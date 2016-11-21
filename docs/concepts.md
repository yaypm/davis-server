## Conversations

One of the core concepts behind Davis is the conversation.  Just like a
conversation with a person, you can have a conversation with Davis.
But, what exactly does that mean?  Basically, Davis
is aware of previous {{exchanges}} and is able to use that information
in order to respond appropriately.  It also allows the user to
keep interacting with Davis without having to use a {{launch phrase}}.

You may be asking, "how do I have a conversation with Davis?".  This
varies by source, but we tried to make it as consistent as possible.
See below for commands listed by source.

#### Alexa

Say:
- "Alexa, launch Davis"
 - "Alexa, ask Davis {{command}}"

 #### Slack

Type (case insensitive):
 - "hey Davis"
 - "hi Davis"
 - "ok Davis"

 ## Exchanges

An exchange is simply a single request and response.  A typical exchange
typically takes the following route:

1. Request received
2. User is validated
3. Request is run through the NLP and Classification engine
4. Plugin hooks are run
5. Response is built
6. Response is sent