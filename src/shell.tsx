import type { ReactNode } from "react";
import { Button, Email, MergeTag, Section, Text, token } from "@hyper-elements/react";
import { theme } from "./theme";

/** The frame every template shares: brand header, white content card, footer. */
export function Shell({ title, preheader, children }: { title: string; preheader: string; children: ReactNode }) {
  return (
    <Email theme={theme} width={600} title={title} previewText={preheader} lang="en" style={{ backgroundColor: token("colors.background"), gap: 0 }}>
      <Section style={{ padding: [30, 40, 14, 40] }}>
        <Text style={{ apply: ["brand"] }}>Fieldnote</Text>
      </Section>
      <Section style={{ backgroundColor: token("colors.card"), padding: [38, 40, 40, 40], gap: 16, border: { top: { width: 3, style: "solid", color: token("colors.accent") } } }}>
        {children}
      </Section>
      <Section style={{ padding: [22, 40, 40, 40], gap: 8 }}>
        <Text style={{ apply: ["small"] }}>
          Questions? Write to <MergeTag name="help_email" />.
        </Text>
        <Text style={{ apply: ["small"] }}>Fieldnote is a made-up product used to show how Mailroom works.</Text>
      </Section>
    </Email>
  );
}

export const Kicker = ({ children, warn }: { children: ReactNode; warn?: boolean }) => (
  <Text style={{ apply: ["kicker"], ...(warn ? { color: token("colors.warn") } : {}) }}>{children}</Text>
);

export const Cta = ({ href, children }: { href: string; children: ReactNode }) => (
  <Button href={href}>{children}</Button>
);
