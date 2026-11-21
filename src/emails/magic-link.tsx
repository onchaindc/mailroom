import { Heading, MergeTag, Text } from "@hyper-elements/react";
import type { Template } from "../registry";
import { Cta, Kicker } from "../shell";

export const magicLink: Template = {
  id: "magic-link",
  name: "Sign-in link",
  blurb: "A one-time sign-in link with a safety note and a fallback URL.",
  subject: () => "Your Fieldnote sign-in link",
  preheader: (tag) => `The link expires in ${tag("expires_in")}.`,
  vars: ["first_name", "magic_link", "expires_in", "device", "location", "help_email"],
  Body: ({ tag }) => (
    <>
      <Kicker>Sign in</Kicker>
      <Heading level={1}>Your sign-in link</Heading>
      <Text>
        Hi <MergeTag name="first_name" />, use the button below to sign in. The link works once and expires in <MergeTag name="expires_in" />.
      </Text>
      <Cta href={tag("magic_link")}>Sign in to Fieldnote</Cta>
      <Text style={{ apply: ["small"] }}>
        Requested from <MergeTag name="device" />, near <MergeTag name="location" />. If that was not you, do not click the button. Your account stays safe, and you can ignore this email.
      </Text>
      <Text style={{ apply: ["small"] }}>
        Button not working? Copy this link into your browser: <MergeTag name="magic_link" />
      </Text>
    </>
  ),
};
