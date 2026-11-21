import { Column, Heading, Html, Link, Page, Row, Section, Span, Table, TableCell, TableRow, Text, token } from "@hyper-elements/react";
import { PROVIDERS } from "./providers";
import { TEMPLATES, VARS } from "./registry";
import { FONT, theme } from "./theme";

const ROSETTA = ["first_name", "magic_link", "order_no"];
const mono = { fontFamily: FONT.mono, fontSize: 13 };

/** The showroom page: every template previewed, the merge-tag spellings side by side, and the downloads. */
export function Gallery({ checked }: { checked: { files: number; warnings: number } }) {
  return (
    <Page theme={theme} width={1040} title="Mailroom" description="One email design, written once and compiled for every sending service." lang="en" style={{ gap: 0 }}>
      <Section style={{ backgroundColor: token("colors.primary"), padding: [64, 32, 56, 32], gap: 14 }}>
        <Text style={{ apply: ["kicker"], color: "#9FB5A9" }}>Built with @hyper-elements/react</Text>
        <Heading level={1} style={{ color: "#FFFFFF", fontSize: 56, mobile: { fontSize: 40 } }}>Mailroom</Heading>
        <Text style={{ fontSize: 22, lineHeight: 1.45, color: "#E8EFEA", maxWidth: 640 }}>
          Write an email once. Ship it to Resend, Postmark, SendGrid, Amazon SES, Mailchimp and Klaviyo, each with its own merge-tag spelling.
        </Text>
        <Text style={{ fontSize: 15, color: "#9FB5A9" }}>
          {TEMPLATES.length} templates, {PROVIDERS.length} services, {checked.files} files generated, {checked.warnings} renderer warnings.
        </Text>
      </Section>

      <Section style={{ padding: [44, 32, 8, 32], gap: 12 }}>
        <Heading level={2}>The same variable, six spellings</Heading>
        <Text style={{ maxWidth: 680 }}>
          Every service writes merge tags differently, and one wrong brace stops a template from rendering. Mailroom writes each tag the way the service documents it.
        </Text>
        <Table style={{ width: "100%", borderCollapse: "collapse", cellPadding: [10, 10, 10, 0], rowBorder: { width: 1, style: "solid", color: token("colors.border") } }}>
          <TableRow header>
            <TableCell>Variable</TableCell>
            {PROVIDERS.map((p) => (
              <TableCell key={p.id}>{p.label}</TableCell>
            ))}
          </TableRow>
          {ROSETTA.map((k) => (
            <TableRow key={k}>
              <TableCell style={mono}>{k}</TableCell>
              {PROVIDERS.map((p) => (
                <TableCell key={p.id} style={mono}>{p.tag(k)}</TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      </Section>

      {TEMPLATES.map((t) => (
        <Section key={t.id} style={{ padding: [40, 32, 12, 32], border: { top: { width: 1, style: "solid", color: token("colors.border") } } }}>
          <Row style={{ gap: 36, alignItems: "start" }}>
            <Column style={{ flex: 1, gap: 12 }}>
              <Text style={{ apply: ["kicker"] }}>Template</Text>
              <Heading level={2}>{t.name}</Heading>
              <Text>{t.blurb}</Text>
              <Text style={{ apply: ["small"] }}>Variables</Text>
              <Text style={{ ...mono, lineHeight: 1.8 }}>{t.vars.map((k) => VARS[k] && k).join("  ")}</Text>
              <Text style={{ apply: ["small"] }}>
                <Link href={`preview/${t.id}.html`}>Open the preview</Link>
              </Text>
            </Column>
            <Column style={{ flex: 1.2 }}>
              <Html
                text={`Preview of the ${t.name} email`}
                html={`<iframe src="preview/${t.id}.html" title="${t.name} email preview" width="100%" height="640" style="border:1px solid #E2DDD0;background:#F4F1EA"></iframe>`}
              />
            </Column>
          </Row>
        </Section>
      ))}

      <Section style={{ padding: [40, 32, 56, 32], gap: 12, border: { top: { width: 1, style: "solid", color: token("colors.border") } } }}>
        <Heading level={2}>Download</Heading>
        <Text>Each cell has the HTML and, where the service takes one, the upload payload.</Text>
        <Table style={{ width: "100%", borderCollapse: "collapse", cellPadding: [10, 10, 10, 0], rowBorder: { width: 1, style: "solid", color: token("colors.border") } }}>
          <TableRow header>
            <TableCell>Template</TableCell>
            {PROVIDERS.map((p) => (
              <TableCell key={p.id}>{p.label}</TableCell>
            ))}
          </TableRow>
          {TEMPLATES.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              {PROVIDERS.map((p) => (
                <TableCell key={p.id} style={{ fontSize: 13 }}>
                  <Link href={`${p.id}/${t.id}.html`}>html</Link>
                  {p.id === "sendgrid" ? <Span> · <Link href={`${p.id}/${t.id}.version.json`}>json</Link></Span> : p.id === "mailchimp" ? null : <Span> · <Link href={`${p.id}/${t.id}.json`}>json</Link></Span>}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
        <Text style={{ apply: ["small"] }}>Fieldnote is a made-up product. All sample data is fictional.</Text>
      </Section>
    </Page>
  );
}
