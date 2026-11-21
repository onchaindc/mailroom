import { defineTheme } from "@hyper-elements/react";

// The look of the sample brand ("Fieldnote"), defined once. Email clients cannot load web fonts,
// so every font here is a safe system stack.
export const FONT = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'SFMono-Regular', Menlo, Consolas, 'Courier New', monospace",
};

export const theme = defineTheme({
  colors: {
    background: "#F4F1EA",
    foreground: "#14221C",
    primary: "#14221C", // ink
    primaryForeground: "#FFFFFF",
    accent: "#1F6F4A", // forest
    highlight: "#F2C94C", // marker yellow
    card: "#FFFFFF",
    muted: "#5B6B63",
    border: "#E2DDD0",
    warn: "#A5391F",
  },
  fonts: { body: FONT.sans },
  fontSizes: { body: 16 },
  lineHeights: { body: 1.6 },
  elements: {
    Heading: {
      fontFamily: FONT.serif,
      fontWeight: 700,
      color: "{colors.primary}",
      by: { level: { 1: { fontSize: 30, lineHeight: 1.2 }, 2: { fontSize: 20, lineHeight: 1.3 } } },
    },
    Button: {
      backgroundColor: "{colors.accent}",
      color: "#FFFFFF",
      borderRadius: 6,
      fontFamily: FONT.sans,
      fontWeight: 700,
      fontSize: 16,
      padding: "14px 26px",
    },
  },
  styles: {
    brand: { fontFamily: FONT.serif, fontSize: 22, fontWeight: 700, color: "{colors.primary}" },
    kicker: { fontFamily: FONT.sans, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "{colors.muted}" },
    small: { fontSize: 13, lineHeight: 1.5, color: "{colors.muted}" },
    mono: { fontFamily: FONT.mono, fontSize: 14 },
  },
});
