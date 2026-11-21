import { render } from "@hyper-elements/react";
import { PROVIDERS, type Built, type Provider, type Tag } from "./providers";
import { TEMPLATES, VARS, varDefs, type Template } from "./registry";
import { Shell } from "./shell";

const design = (t: Template, tag: Tag) => (
  <Shell title={t.subject(tag)} preheader={t.preheader(tag)}>
    <t.Body tag={tag} />
  </Shell>
);

export type Result = { template: Template; provider: Provider; built: Built; diagnostics: { severity: string; code: string; message: string }[] };

/**
 * Renders one template for one service. Inline tags (<MergeTag>) are written by the render() option.
 * Links, the subject and the preheader are plain strings, so they use the same tag function directly.
 */
export async function renderFor(t: Template, p: Provider): Promise<Result> {
  const r = await render(design(t, p.tag), { mergeTag: p.tag });
  const built: Built = { id: t.id, name: `Fieldnote ${t.name}`, subject: t.subject(p.tag), html: r.html, text: r.text, vars: varDefs(t.vars) };
  return { template: t, provider: p, built, diagnostics: r.diagnostics as Result["diagnostics"] };
}

/** A preview: every tag is replaced by its sample value, so you see what a customer sees. */
export async function renderPreview(t: Template) {
  const sample: Tag = (k) => VARS[k].sample;
  const r = await render(design(t, sample), { mergeTag: sample });
  return { html: r.html, text: r.text, subject: t.subject(sample), diagnostics: r.diagnostics };
}

export const allResults = async () => {
  const out: Result[] = [];
  for (const t of TEMPLATES) for (const p of PROVIDERS) out.push(await renderFor(t, p));
  return out;
};
