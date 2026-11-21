// How each sending service writes a merge tag and what its "create template" call expects.
// Every spelling and payload shape here was checked against that service's own documentation
// (see the README for the links). The payloads are generated and tested, but not sent to live accounts.

export type Tag = (key: string) => string;
export type VarDef = { key: string; label: string; sample: string };
export type Built = { id: string; name: string; subject: string; html: string; text: string; vars: VarDef[] };
export type OutFile = { file: string; json: unknown };

export type Provider = {
  id: string;
  label: string;
  /** Writes one merge tag the way this service expects it. */
  tag: Tag;
  /** Matches every merge tag of this service inside rendered output. */
  pattern: RegExp;
  /** Files to upload, besides the .html and .txt every service gets. */
  files: (t: Built) => OutFile[];
  how: string;
  docs: string;
};

const mailchimpName = (k: string) => ({ first_name: "FNAME", last_name: "LNAME", email: "EMAIL" } as Record<string, string>)[k] ?? k.toUpperCase();

export const PROVIDERS: Provider[] = [
  {
    id: "resend",
    label: "Resend",
    tag: (k) => `{{{${k.toUpperCase()}}}}`,
    pattern: /\{\{\{[A-Z0-9_]+\}\}\}/g,
    files: (t) => [
      {
        file: `${t.id}.json`,
        json: {
          name: t.name,
          alias: t.id,
          subject: t.subject,
          html: t.html,
          variables: t.vars.map((v) => ({ key: v.key.toUpperCase(), type: "string", ...(v.key === "first_name" ? { fallback_value: "there" } : {}) })),
        },
      },
    ],
    how: "POST https://api.resend.com/templates, then publish it. Triple braces are required: double braces do not render.",
    docs: "https://resend.com/docs/api-reference/templates/create-template",
  },
  {
    id: "postmark",
    label: "Postmark",
    tag: (k) => `{{${k}}}`,
    pattern: /\{\{[a-z0-9_]+\}\}/g,
    files: (t) => [{ file: `${t.id}.json`, json: { Name: t.name, Alias: t.id, Subject: t.subject, HtmlBody: t.html, TextBody: t.text } }],
    how: "POST https://api.postmarkapp.com/templates (Mustachio syntax). Send with /email/withTemplate and a TemplateModel.",
    docs: "https://postmarkapp.com/support/article/1077-template-syntax",
  },
  {
    id: "sendgrid",
    label: "SendGrid",
    tag: (k) => `{{${k}}}`,
    pattern: /\{\{[a-z0-9_]+\}\}/g,
    files: (t) => [
      { file: `${t.id}.template.json`, json: { name: t.name, generation: "dynamic" } },
      {
        file: `${t.id}.version.json`,
        json: { name: `${t.name} v1`, subject: t.subject, html_content: t.html, plain_content: t.text, generate_plain_content: false, active: 1, editor: "code" },
      },
    ],
    how: "POST /v3/templates with the .template.json, then POST /v3/templates/{id}/versions with the .version.json (Handlebars).",
    docs: "https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates/create-a-transactional-template",
  },
  {
    id: "ses",
    label: "Amazon SES",
    tag: (k) => `{{${k}}}`,
    pattern: /\{\{[a-z0-9_]+\}\}/g,
    files: (t) => [{ file: `${t.id}.json`, json: { TemplateName: t.id, TemplateContent: { Subject: t.subject, Text: t.text, Html: t.html } } }],
    how: "aws sesv2 create-email-template --cli-input-json file://<template>.json. TemplateData is an escaped JSON string.",
    docs: "https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-personalized-email-api.html",
  },
  {
    id: "mailchimp",
    label: "Mailchimp",
    tag: (k) => `*|${mailchimpName(k)}|*`,
    pattern: /\*\|[A-Z0-9_]+\|\*/g,
    files: () => [],
    how: "Paste the HTML into a custom-coded template. Create a matching audience merge field for every tag that is not built in (FNAME, LNAME, EMAIL).",
    docs: "https://mailchimp.com/help/all-the-merge-tags-cheat-sheet/",
  },
  {
    id: "klaviyo",
    label: "Klaviyo",
    tag: (k) => `{{ ${k} }}`,
    pattern: /\{\{ [a-z0-9_]+ \}\}/g,
    files: (t) => [{ file: `${t.id}.json`, json: { data: { type: "template", attributes: { name: t.name, editor_type: "CODE", html: t.html, text: t.text } } } }],
    how: "POST https://a.klaviyo.com/api/templates with a private API key. The subject line is set on the campaign or flow message, not the template.",
    docs: "https://developers.klaviyo.com/en/reference/templates_api_overview",
  },
];

export const PROVIDER_BY_ID = Object.fromEntries(PROVIDERS.map((p) => [p.id, p]));
