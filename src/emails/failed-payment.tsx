import { Heading, MergeTag, Text } from "@hyper-elements/react";
import type { Template } from "../registry";
import { Cta, Kicker } from "../shell";

export const failedPayment: Template = {
  id: "failed-payment",
  name: "Failed payment",
  blurb: "A calm, specific failed-payment notice with one fix.",
  subject: () => "Action needed: your Fieldnote payment failed",
  preheader: (tag) => `We will retry on ${tag("retry_on")}.`,
  vars: ["first_name", "amount", "plan", "card_last4", "retry_on", "fix_url", "help_email"],
  Body: ({ tag }) => (
    <>
      <Kicker warn>Payment failed</Kicker>
      <Heading level={1}>We could not charge your card</Heading>
      <Text>
        Hi <MergeTag name="first_name" />, the payment of <MergeTag name="amount" /> for <MergeTag name="plan" /> did not go through on the card ending in <MergeTag name="card_last4" />.
      </Text>
      <Text>
        Your notes are safe and your plan stays active while we try again on <MergeTag name="retry_on" />. Updating your card now avoids any interruption.
      </Text>
      <Cta href={tag("fix_url")}>Update payment method</Cta>
      <Text style={{ apply: ["small"] }}>If the card details are correct, your bank may have declined the charge. A quick call to them usually fixes it.</Text>
    </>
  ),
};
