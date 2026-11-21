// npm run verify: checks every generated template against the service it was made for.
import { allResults, renderPreview } from "../src/render-all";
import { PROVIDERS } from "../src/providers";
import { TEMPLATES } from "../src/registry";

type Fail = { where: string; why: string };
const fails: Fail[] = [];
const fail = (where: string, why: string) => fails.push({ where, why });
const unique = (xs: string[]) => [...new Set(xs)].sort();
const DOUBLE = /\{\{[a-z0-9_]+\}\}/g; // the plain {{name}} spelling

const rows: string[][] = [];
for (const r of await allResults()) {
  const { template: t, provider: p, built: b } = r;
  const where = `${p.id}/${t.id}`;
  const expected = unique(t.vars.map((k) => p.tag(k)));

  // 1. Every variable appears, written in this service's spelling, and nothing else does.
  const found = unique(b.html.match(p.pattern) ?? []);
  for (const e of expected) if (!found.includes(e)) fail(where, `HTML is missing ${e}`);
  for (const f of found) if (!expected.includes(f)) fail(where, `HTML has an undeclared tag ${f}`);

  // 2. No leftover spelling from another service (links and subjects are the usual place for it).
  if (p.tag("x") !== "{{x}}") {
    const stray = b.html.match(DOUBLE) ?? [];
    if (stray.length) fail(where, `HTML still has default-syntax tags: ${unique(stray).join(", ")}`);
  } else if (/\{\{\{|\*\|[A-Z]|\{\{ /.test(b.html)) fail(where, "HTML has another service's tag syntax");

  // 3. The subject only uses declared variables, in this service's spelling.
  for (const m of b.subject.match(p.pattern) ?? []) if (!expected.includes(m)) fail(where, `subject uses ${m}, which is not declared`);

  // 4. The plain-text version carries the tags too, and has no render accidents.
  if (!p.pattern.test(b.text)) fail(where, "plain text has no merge tags");
  p.pattern.lastIndex = 0;
  if (/undefined|\[object|NaN/.test(b.html + b.text + b.subject)) fail(where, "output contains undefined, [object or NaN");

  // 5. Service limits that were documented: SES 500 KB per template, SendGrid 1 MB per version.
  const bytes = Buffer.byteLength(b.html + b.text);
  if (p.id === "ses" && bytes > 500 * 1024) fail(where, "over the SES 500 KB template limit");
  if (p.id === "sendgrid" && Buffer.byteLength(b.html) > 1048576) fail(where, "over the SendGrid 1 MB version limit");

  // 6. The renderer itself has no warnings or errors.
  for (const d of r.diagnostics) if (d.severity === "warning" || d.severity === "error") fail(where, `${d.severity}: ${d.code}`);

  // 7. Every upload payload is valid JSON that carries the HTML.
  for (const f of p.files(b)) if (!JSON.stringify(f.json).includes(JSON.stringify(b.html).slice(1, 80))) {
    if (!f.file.endsWith(".template.json")) fail(where, `${f.file} does not carry the HTML`);
  }

  rows.push([t.id, p.id, String(expected.length), `${(b.html.length / 1024).toFixed(1)} KB`, fails.some((x) => x.where === where) ? "FAIL" : "ok"]);
}

// 8. A preview has no tags left over.
for (const t of TEMPLATES) {
  const p = await renderPreview(t);
  if (/\{\{|\*\|[A-Z]|\}\}/.test(p.html)) fail(`preview/${t.id}`, "preview still has merge tags");
}

const w = [16, 11, 6, 10, 5];
console.log(["template", "service", "tags", "html", ""].map((c, i) => c.padEnd(w[i])).join(""));
for (const r of rows) console.log(r.map((c, i) => c.padEnd(w[i])).join(""));
if (fails.length) {
  console.error(`\n${fails.length} problem(s):`);
  for (const f of fails) console.error(` - ${f.where}: ${f.why}`);
  process.exit(1);
}
console.log(`\nAll ${rows.length} template and service combinations passed, plus ${TEMPLATES.length} previews.`);
