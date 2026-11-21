import { Heading, ListItem, List, MergeTag, Text } from "@hyper-elements/react";
import type { Template } from "../registry";
import { Cta, Kicker } from "../shell";

export const welcome: Template = {
  id: "welcome",
  name: "Welcome",
  blurb: "The first email after sign-up. One clear action.",
  subject: (tag) => `Welcome to Fieldnote, ${tag("first_name")}`,
  preheader: () => "Your notebook is ready. Three things to try first.",
  vars: ["first_name", "login_url", "help_email"],
  Body: ({ tag }) => (
    <>
      <Kicker>Welcome</Kicker>
      <Heading level={1}>
        Hi <MergeTag name="first_name" />, your notebook is ready.
      </Heading>
      <Text>Fieldnote keeps your notes in one place and finds them again when you need them. Three things worth trying first:</Text>
      <List type="number" style={{ gap: 6 }}>
        <ListItem>Press N anywhere to capture a thought.</ListItem>
        <ListItem>Link two notes by wrapping a title in double square brackets.</ListItem>
        <ListItem>Search by date, for example "last week".</ListItem>
      </List>
      <Cta href={tag("login_url")}>Open Fieldnote</Cta>
      <Text style={{ apply: ["small"] }}>You sign in with your email address. If you did not create this account, you can ignore this message.</Text>
    </>
  ),
};
