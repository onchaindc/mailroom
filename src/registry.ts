import type { ReactNode } from "react";
import type { Tag, VarDef } from "./providers";
import { welcome } from "./emails/welcome";
import { magicLink } from "./emails/magic-link";
import { receipt } from "./emails/receipt";
import { failedPayment } from "./emails/failed-payment";
import { trialEnding } from "./emails/trial-ending";

/** Every variable a template can use, with the sample value used for previews. */
export const VARS: Record<string, { label: string; sample: string }> = {
  first_name: { label: "First name", sample: "Maya" },
  help_email: { label: "Support address", sample: "help@fieldnote.example" },
  login_url: { label: "App link", sample: "https://app.fieldnote.example/open" },
  magic_link: { label: "One-time sign-in link", sample: "https://app.fieldnote.example/auth/verify?token=3f9c1a" },
  expires_in: { label: "Link lifetime", sample: "15 minutes" },
  device: { label: "Device", sample: "Chrome on macOS" },
  location: { label: "Approximate location", sample: "Austin, Texas" },
  order_no: { label: "Order number", sample: "FN-20418" },
  plan: { label: "Plan name", sample: "Fieldnote Pro (monthly)" },
  amount: { label: "Amount", sample: "$12.00" },
  billed_on: { label: "Billing date", sample: "21 Nov 2026" },
  card_last4: { label: "Card, last four digits", sample: "4242" },
  receipt_url: { label: "Receipt link", sample: "https://app.fieldnote.example/billing/receipts/FN-20418" },
  billing_url: { label: "Billing page link", sample: "https://app.fieldnote.example/billing" },
  retry_on: { label: "Next retry date", sample: "24 Nov 2026" },
  fix_url: { label: "Update payment link", sample: "https://app.fieldnote.example/billing/update" },
  days_left: { label: "Trial days left", sample: "3 days" },
  ends_on: { label: "Trial end date", sample: "24 Nov 2026" },
  price: { label: "Price", sample: "$12 a month" },
  upgrade_url: { label: "Upgrade link", sample: "https://app.fieldnote.example/billing/upgrade" },
};

export type Template = {
  id: string;
  name: string;
  blurb: string;
  /** Subject and preheader are plain strings, so they use the same tag function as links. */
  subject: (tag: Tag) => string;
  preheader: (tag: Tag) => string;
  /** Every variable the template uses, including links, subject and preheader. */
  vars: string[];
  Body: (p: { tag: Tag }) => ReactNode;
};

export const TEMPLATES: Template[] = [welcome, magicLink, receipt, failedPayment, trialEnding];

export const varDefs = (keys: string[]): VarDef[] => keys.map((key) => ({ key, ...VARS[key] }));
