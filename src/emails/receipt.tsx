import { Heading, Link, MergeTag, Table, TableCell, TableRow, Text, token } from "@hyper-elements/react";
import type { ReactNode } from "react";
import type { Template } from "../registry";
import { Cta, Kicker } from "../shell";

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <TableRow>
    <TableCell style={{ width: 150, color: token("colors.muted"), fontSize: 14 }}>{label}</TableCell>
    <TableCell style={{ fontWeight: 700 }}>{children}</TableCell>
  </TableRow>
);

export const receipt: Template = {
  id: "receipt",
  name: "Receipt",
  blurb: "A payment receipt with the order details in a table.",
  subject: (tag) => `Your Fieldnote receipt ${tag("order_no")}`,
  preheader: (tag) => `${tag("amount")} paid on ${tag("billed_on")}`,
  vars: ["first_name", "card_last4", "billed_on", "order_no", "plan", "amount", "receipt_url", "billing_url", "help_email"],
  Body: ({ tag }) => (
    <>
      <Kicker>Receipt</Kicker>
      <Heading level={1}>
        Thanks, <MergeTag name="first_name" />. Payment received.
      </Heading>
      <Text>
        We charged the card ending in <MergeTag name="card_last4" /> on <MergeTag name="billed_on" />.
      </Text>
      <Table style={{ width: "100%", borderCollapse: "collapse", cellPadding: [10, 8, 10, 0], rowBorder: { width: 1, style: "solid", color: token("colors.border") } }}>
        <Row label="Order"><MergeTag name="order_no" /></Row>
        <Row label="Plan"><MergeTag name="plan" /></Row>
        <Row label="Amount"><MergeTag name="amount" /></Row>
        <Row label="Date"><MergeTag name="billed_on" /></Row>
      </Table>
      <Cta href={tag("receipt_url")}>View receipt</Cta>
      <Text style={{ apply: ["small"] }}>
        Need to change your card? <Link href={tag("billing_url")}>Manage billing</Link>.
      </Text>
    </>
  ),
};
