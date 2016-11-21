How It Works
============

Davis
-----

The Davis class is the core class of the Davis system. It coordinates all of the parts of the
system, enabling them to work seamlessly together to create a cohesive experience for the user.
In addition to instantiating and holding all other classes, the Davis class is responsible for
the following things:

- Server start up
- Logging
- Database connection
- Source start up
- Service start up

Plugin Manager
--------------

The plugin manager does the work of coordinating the functionality of the Davis system. All
Davis functionality is contained in plugin modules. Plugins register intents, which in turn have
lifecycle events. A simple way to break down the hierarchy is that a plugin should be responsible
for a category of interaction (Does this relate to problems, or the weather?). An intent should
be responsible for a specific type of interaction within a category (Is the user asking for problems
in a time range, or for details about a specific problem?). Lifecycle events are responsible for
the actual steps needed to carry out an intent (gather data, process data, decide what is important,
respond).

Conversation
------------

In Davis, a conversation is between a user and the Davis system, regardless of what system the user
uses to converse. This means that a user can start talking no their Amazon echo, and carry on
the conversation on Slack part way through the conversation.

Exchange
--------

The first thing that happens when you talk to Davis is an exchange object is created. An exchange
in Davis is a single question/response, like "what happened yesterday? Nothing happened yesterday."
The exchange object is responsible for coordinating all necessary context and state required
to process the current exchange. This includes:

### Processed Natural Language Data

- Time Range (Is the user asking about a specific time range?)
- Apps discovered in phrases (Is the user asking about a particular application?)
- Intent classification (is the user asking about problems or scalability?)

Natural language processing is one of the more complicated and advanced aspects of the Davis system.
More information can be found below.

### Conversation context

Any plugin can register conversation context that will be stored through multiple exchanges.
This allows plugins to share state and communicate with each other, enabling multiple-exchange
interactions with Davis ("What happened yesterday? There were 3 problems yesterday.
Tell me about the first one."). Anything a plugin stores in the conversation context object
will be available to any other plugin that runs later, unless it is specifically cleared.
Conversation context is also available to be used in templates.

### Responses

The exchange object is the mechanism by which a plugin interacts with the user. when
a plugin is called it has access to the exchange object, which gives a plugin everything
it needs to make a decision and generate a response for the user. After that, it attaches
that response to the exchange object. For instance, a plugin that gives the user data about
the weather might have two intents. The first intent would give a basic overview of the weather,
then would ask the user if they would like to have a more detailed answer that would be generated
by the second intent. After the first intent is called, it would respond to the user like this:

User asks "What is the weather like in Detroit today?

    exchange
      .addContext({
        targetIntent: 'weatherDetails',
        city: 'Detroit',
        timeRange: 'today',
      })
      .greet()
      .response('The weather is 69 degrees and sunny')
      .followUp('Would you like to know more?');

This sets the target intent for the follow up question, greets the user (How are you?),
sends the appropriate response, and asks a follow up question. After the user responds yes or no,
the built in routing intent will call the intent referenced by  the `targetIntent` property of the
context object (in this case weatherDetails). That intent will have access to everything our intent
put into the context object, thereby giving it everything it needs to respond intelligently.

Natural Language Processing
---------------------------

Natural language processing is one of the most important parts of the Davis system. It is also
the 'secret sauce' that allows Davis to be so advanced. Natural language processing in Davis is
broken down into the following major categories:

- Time range recognition
- Application recognition
- Intent classification

### Time Range Recognition

Every exchange that requires time data goes through our advanced probabilistic date time parser
hosted on Amazon Lambda and powered by the [duckling](https://github.com/wit-ai/duckling) library.
This allows not only for basic date recognition like "What happened yesterday," but also for more
advanced queries like "What happened yesterday between 10am and noon?"

### Application Recognition

Another important part of the Davis NLP system is recognition of apps monitored by the Dynatrace
Platform. In the future we hope to extend this to be able to recognize and extract arbitrary
user-defined data types.

### Intent classification

The final piece of the Davis NLP module is the intent classification. This is done using another
probabilistic parser, allowing for fuzzy matching and inexact phrase matching. For instance,
if the model was trained using the phrases "What happened yesterday?" and "Were there any issues
yesterday?" The model could also detect phrases like "What was happening yesterday?" and "Yesterday
were there any issues?" This is accomplished by performing tokenization and stemming prior to
classification. In the tokenization step, the phrase is broken down into word chunks. Next,
the words are stemmed (Happening becomes happen, extraction becomes extract, implication becomes
implic). This makes the system robust to differences like 'happened' vs 'happening'. Finally, the text
goes through feature extraction where the phrase is transformed into a numerical vector representation.
Once all of this is done, a logarithmic regression classifies the phrase into its final intent.

    'What happened yesterday?' // original phrase
    [ 'What', 'happened', 'yesterday' ] // tokenization
    [ 'what', 'happen', 'yesterdai' ] // stemming
    'problem' // final intent