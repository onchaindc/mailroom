import { Heading, MergeTag, Text } from "@hyper-elements/react";
import type { Template } from "../registry";
import { Cta, Kicker } from "../shell";

export const trialEnding: Template = {
  id: "trial-ending",
  name: "Trial ending",
  blurb: "A trial reminder that says plainly what happens if you do nothing.",
  subject: (tag) => `Your Fieldnote trial ends in ${tag("days_left")}`,
  preheader: () => "Keep your notes with Fieldnote Pro.",
  vars: ["first_name", "days_left", "ends_on", "price", "upgrade_url", "help_email"],
  Body: ({ tag }) => (
    <>
      <Kicker>Trial</Kicker>
      <Heading level={1}>
        Your trial ends in <MergeTag name="days_left" />
      </Heading>
      <Text>
        Hi <MergeTag name="first_name" />, your Fieldnote Pro trial ends on <MergeTag name="ends_on" />. Keep unlimited notes and search for <MergeTag name="price" />.
      </Text>
      <Cta href={tag("upgrade_url")}>Keep Fieldnote Pro</Cta>
      <Text style={{ apply: ["small"] }}>
        Not for you? Do nothing, and your account moves to the free plan on <MergeTag name="ends_on" />. Nothing is deleted.
      </Text>
    </>
  ),
};
