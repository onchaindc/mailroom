// npm run build: compile every template for every service into out/, plus previews and the gallery.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "@hyper-elements/react";
import { Gallery } from "./gallery";
import { allResults, renderPreview } from "./render-all";
import { TEMPLATES } from "./registry";

const out = resolve("out");
const put = async (path: string, data: string) => {
  const file = resolve(out, path);
  await mkdir(resolve(file, ".."), { recursive: true });
  await writeFile(file, data);
};

let files = 0;
let warnings = 0;

for (const r of await allResults()) {
  const dir = r.provider.id;
  await put(`${dir}/${r.template.id}.html`, r.built.html);
  await put(`${dir}/${r.template.id}.txt`, r.built.text);
  files += 2;
  for (const f of r.provider.files(r.built)) {
    await put(`${dir}/${f.file}`, JSON.stringify(f.json, null, 2) + "\n");
    files += 1;
  }
  warnings += r.diagnostics.filter((d) => d.severity === "warning" || d.severity === "error").length;
}

for (const t of TEMPLATES) {
  const p = await renderPreview(t);
  await put(`preview/${t.id}.html`, p.html);
  await put(`preview/${t.id}.txt`, `Subject: ${p.subject}\n\n${p.text}`);
  files += 2;
}

const gallery = await render(<Gallery checked={{ files, warnings }} />);
await put("index.html", gallery.html);
console.log(`Wrote ${files} files for ${TEMPLATES.length} templates to out/ (${warnings} renderer warnings). Open out/index.html.`);
for (const d of gallery.diagnostics.filter((x) => x.severity !== "info")) console.log(`gallery ${d.severity}: ${d.code} ${String(d.message).slice(0, 140)}`);
