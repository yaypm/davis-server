One of the cornerstone features of Davis is its ease of extensibility and customization.
All of the functionality of Davis is implemented through the plugin system, from problems
to routing. In order to showcase how simple it is to create a new intent, I'm going to create
a weather intent using the [Weather Underground API](https://www.wunderground.com/weather/api/).
Grab an API key and we can get started. The free tier is more than enough for this simple
application. First, we have to set up a Davis environment. The full code for the finished plugin
can be found [here](../../examples/davisWeather/).

# Davis Setup

    $ mkdir Davis && cd Davis

Set up your package.json as follows, then run `npm install` to install dependencies.

```JSON
{
  "name": "my-davis-app",
  "version": "0.0.1",
  "description": "Davis Server Instance",
  "main": "./index.js",
  "license": "MIT",
  "engines": {
    "node": ">= 6.0.0"
  },
  "scripts": {
    "start": "node ./index.js"
  },
  "author": "",
  "dependencies": {
    "dynatrace-davis": "dynatrace/davis-server",
    "bluebird": "^3.4.6",
    "request": "^2.75.0",
    "request-promise": "^4.1.1"
  }
}
```

In order to connect Davis to Dynatrace, you have two options.

1. Create a file named `.env` with the following contents, substituting your Dynatrace credentials
2. Set the following environment variables with your Dynatrace credentials.

```
DYNATRACE_URL=https://your.dynatrace.url/
DYNATRACE_TOKEN=your_dynatrace_api_token
DYNATRACE_STRICT=false
```

Now create a file named `index.js`. This will be our main starting point for our Davis instance.
Here is a basic `index.js` file to start Davis with core plugins only.

```JavaScript
#!/usr/bin/env node

'use strict';


const BbPromise = require('bluebird');

(() => BbPromise.resolve().then(() => {
  // require here so that if anything goes wrong during require,
  // it will be caught.
  const Davis = require('dynatrace-davis'); // eslint-disable-line global-require

  const davis = new Davis({
    logLevel: 'debug', // log level set to Debug so we can make sure we know exactly what is going on
  });

  return davis.run(); // this starts the main Davis process.
}))();
```

Now if you run `node ./index.js` you should see Davis starting up!

```
    ____                    __
   / __ \__  ______  ____ _/ /__________  ________
  / / / / / / / __ \/ __ `/ __/ ___/ __ `/ ___/ _ \
 / /_/ / /_/ / / / / /_/ / /_/ /__/ /_/ / /__/  __/
/_____/\__, /_____/\__,_/\__/\___/\__,_/\___/\___/
      /____// __ \____ __   __(_)____
           / / / / __ `/ | / / / ___/
          / /_/ / /_/ /| |/ / (__  )
         /_____/\__,_/ |___/_/____/

  Your Environment Information ----------------------------
     OS:                 win32
     Node Version:       6.9.1
     Davis Version:      0.2.0
     Production:         false
DEBUG: Connecting to MongoDB
DEBUG: MongoDB Connected
DEBUG: Successfully pulled the latest configuration from MongoDB.
INFO: A default user has been created.
INFO: Learning everything there is to know about APM.
INFO: Loading plugins in c:\Users\Daniel.Dyla\Davis\node_modules\dynatrace-davis\lib\plugins
DEBUG: Found 15 plugin candidates
DEBUG: Loaded plugin: Problem
DEBUG: Loaded plugin: Routing
DEBUG: Loaded plugin: Help
DEBUG: Loaded plugin: DavisVersion
DEBUG: Loaded plugin: Launch
DEBUG: Loaded plugin: ProblemDetails
DEBUG: Loaded plugin: Scalability
DEBUG: Loaded plugin: Stop
DEBUG: Loaded plugin: Thanks
DEBUG: Loaded plugin: Unknown
DEBUG: Loaded plugin: UserActivity
DEBUG: Loaded plugin: Ping
DEBUG: Loaded plugin: ProblemNotification
DEBUG: Loaded plugin: PushLink
DEBUG: Loaded plugin: AutoFollowUp
DEBUG: Loaded 15 core plugins
DEBUG: Loaded 0 user plugins
INFO: Training the NLP model
INFO: I would say it's safe to consider me an APM expert now!
INFO: DYNATRACE API: /api/v1/entity/applications 200 - 142 ms
INFO: DYNATRACE API: /api/v1/entity/services 200 - 185 ms
INFO: Found 16 applications running 90 services.
INFO: Finished loading entities.
INFO: Skipping initialization of the Slack integration.
INFO: Server started successfully after 2226 ms.
INFO: Davis server is now listening on port 3000.
```


# Creating a Custom Plugin

Now that Davis is running, we're ready to create our first custom plugin. First, create
a directory for your plugin. Since we're creating a weather plugin, I'm going to name
the folder `davisWeather`. Inside your folder create a file named `index.js` and give it the
following contents:

```JavaScript
'use strict';

/**
 * The DavisWeather class is the core of the plugin and an
 * instance of DavisWeather is what will be loaded into Davis
 */
class DavisWeather {

  /**
   * The main body of work is done in the constructor.
   */
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    // This is where we declare our intents.
    this.intents = {
      // Our intent name
      davisWeather: {
        // A basic description of the intent
        usage: 'Check the weather in Detroit',

        // Phrases that will trigger our intent. Note that they will not
        // need to be matched exactly in order for the intent to run.
        phrases: [
          'What is the weather like in Detroit?',
          'Check the weather in Detroit',
        ],

        // Lifecycle Events are friendly names for the steps that an intent
        // needs to take in order to run successfully. For instance, our intent
        // will need to gather data from the weather underground API, then will
        // need to respond to the user, so I have broken it up into those events.
        lifecycleEvents: [
          'gatherData',
          'respond',
        ],
      },
    };

    // Hooks give intents functionality.
    // They are called serially when an intent is run.
    // They are named using the 'intentName:lifecycleEvent'
    // Each hook is called with 2 arguments: the exchange object,
    // and a context object. The exchange object is the primary
    // interface between Davis, a user, and a plugin. The context
    // object holds any state carried over from previous exchanges.
    this.hooks = {
      'davisWeather:gatherData': (exchange, context) => null,
      'davisWeather:respond': (exchange, context) => {
        const resp = 'Right now the weather intent does nothing.';

        exchange
          .response(resp) // respond to the user
          .smartEnd(); // end the conversation if appropriate
      },
    };
  }
}

// export the plugin so it can be used
module.exports = DavisWeather;
```

We will also need to modify our main `index.js` file to load our plugin. It should
now look like this (notice the addition to the Davis constructor):

```JavaScript
#!/usr/bin/env node

'use strict';


const BbPromise = require('bluebird');

// process.on('unhandledRejection', e => logError(e));
// process.noDeprecation = true;

(() => BbPromise.resolve().then(() => {
  // require here so that if anything goes wrong during require,
  // it will be caught.
  const Davis = require('dynatrace-davis'); // eslint-disable-line global-require

  const davis = new Davis({
    logLevel: 'debug',
    userPlugins: ['./davisWeather'], // this line is new (You may need to modify
  });                                // your path if your foldername is different)

  return davis.run();
}))();
```

Now try restarting your Davis instance and saying "Check the Detroit weather." Notice
that "Check the Detroit Weather" is not a phrase that the intent was trained on directly,
but works to trigger the intent anyways. For more information on how this works, see
[here](../concepts.md).

# Adding Functionality

Now that we know the intent works, we need to make it actually do something.
Previously, our `davisWeather:gatherData` hook just pointed to `null`. Now we're
going to make it do what its name implies and gather weather data from the Weather
Underground API. First, add your API key in a const at the top of the file. Also,
require the request promise library as we're going to be using it for communication
with the API. Now the top of your file should look like this:

```JavaScript
'use strict';

const rp = require('request-promise');
const API_KEY = 'your_api_key';
```

Next, we need to add functionality to the `gatherData` hook. Do this by
adding a function body like this. Notice that the function returns a promise
now. This allows us to make the async call to the weather underground API and
still treat the entire plugin process as a serial process.

```JavaScript
'davisWeather:gatherData': (exchange, context) => {
  // Weather Underground API options
  const opts = {
    uri: `http://api.wunderground.com/api/${API_KEY}/conditions/q/MI/Detroit.json`,
    json: true,
  }

  // Hooks can optionally return a promise. The next hook will not run until
  // the returned promise is resolved or rejected.
  return rp(opts)
    .then(resp => {
      // Here we add the weather data to the context object. The conversation
      // context survives accross multiple exchanges, making it useful for
      // communicating data between hooks.
      exchange.addContext({
        weather: resp['current_observation'],
      })
    })
}
```

Finally, we need to actually do something with that data in the `respond` hook.

```JavaScript
'davisWeather:respond': (exchange, context) => {
// Building the weather output.
let out = 'The weather in Detroit is currently ';
out += context.weather.weather;
out += ' with a temperature of ';
out += context.weather.temp_f;
out += ' degrees, and a ';
out += context.weather.wind_string;
out += ' wind out of the ';
out += context.weather.wind_dir;
out += '.';

exchange
  .response(out) // respond to the user
  .smartEnd(); // end the conversation if appropriate
}
```

Now your entire plugin file should look like this:

```JavaScript
'use strict';

const rp = require('request-promise');
const API_KEY = 'your_api_key';

/**
 * The DavisWeather class is the core of the plugin and an
 * instance of DavisWeather is what will be loaded into Davis
 */
class DavisWeather {

  /**
   * The main body of work is done in the constructor.
   */
  constructor(davis, options) {
    this.davis = davis;
    this.options = options;

    // This is where we declare our intents.
    this.intents = {
      // Our intent name
      davisWeather: {
        // A basic description of the intent
        usage: 'Check the weather in Detroit',

        // Phrases that will trigger our intent. Note that they will not
        // need to be matched exactly in order for the intent to run.
        phrases: [
          'What is the weather like in Detroit?',
          'Check the weather in Detroit',
        ],

        // Lifecycle Events are friendly names for the steps that an intent
        // needs to take in order to run successfully. For instance, our intent
        // will need to gather data from the weather underground API, then will
        // need to respond to the user, so I have broken it up into those events.
        lifecycleEvents: [
          'gatherData',
          'respond',
        ],
      },
    };

    // Hooks give intents functionality.
    // They are called serially when an intent is run.
    // They are named using the 'intentName:lifecycleEvent'
    // Each hook is called with 2 arguments: the exchange object,
    // and a context object. The exchange object is the primary
    // interface between Davis, a user, and a plugin. The context
    // object holds any state carried over from previous exchanges.
    this.hooks = {
      'davisWeather:gatherData': (exchange, context) => {
        // Weather Underground API options
        const opts = {
          uri: `http://api.wunderground.com/api/${API_KEY}/conditions/q/MI/Detroit.json`,
          json: true,
        }

        // Hooks can optionally return a promise. The next hook will not run until
        // the returned promise is resolved or rejected.
        return rp(opts)
          .then(resp => {
            // Here we add the weather data to the context object. The conversation
            // context survives accross multiple exchanges, making it useful for
            // communicating data between hooks.
            exchange.addContext({
              weather: resp['current_observation'],
            })
          })
      },
      'davisWeather:respond': (exchange, context) => {

        // Building the weather output.
        let out = 'The weather in Detroit is currently ';
        out += context.weather.weather;
        out += ' with a temperature of ';
        out += context.weather.temp_f;
        out += ' degrees, and a ';
        out += context.weather.wind_string;
        out += ' wind out of the ';
        out += context.weather.wind_dir;
        out += '.';

        exchange
          .response(out) // respond to the user
          .smartEnd(); // end the conversation if appropriate
      },
    };
  }
}

// export the plugin so it can be used
module.exports = DavisWeather;
```

Now restart Davis and try saying again, "Check the Detroit weather." You should get
a response like "The weather in Detroit is currently Mostly Cloudy with a temperature of 41 degrees,
and a Calm wind out of the North." Congratulations, you've officially built your first
Davis plugin that pulls and displays data from a third party API.

# Templates

Now that basic functionality is completed, lets work on cleaning up the plugin by adding
a template. Right now the output string is built by concatenating strings together. This
works, but it is very cumbersome and not very flexible. A template moves all of the string
building logic out of the JavaScript file. This allows the JavaScript file to orchestrate
the plugin without having to worry about how it is output, giving us a cleaner separation of
concerns and a plugin that is easier to extend and maintain. First add a folder named `templates`
to the root of your plugin, and add a file named `default.nj` to the folder. Your folder
structure should now look like this.

```
DavisWeather
+---index.js
+---templates
    +---default.nj
index.js
package.json
```

The contents of the `default.nj` file should be as follows:

```
The weather in {{ weather.display_location.city }} is currently {{ weather.weather }} with a
temperature of {{ weather.temp_f}} degrees, and a {{ weather.wind_string }} wind out of
the {{ weather.wind_dir }}.
```

Now we need to change the plugin's `index.js` file to use the new template. This only requires
changing the `davisWeather:respond` hook to look like this:

```JavaScript
'davisWeather:respond': (exchange, context) => {

  const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);

  exchange
    .response(templates) // respond to the user
    .smartEnd(); // end the conversation if appropriate
}
```

Notice that the only difference is that the `out` string has now been replaced by a call to a
function that automatically finds, processes, and builds the template for you. The template
has access to any variables set in the context object, so it already has the weather data it needs
from the `davisWeather:gatherData` hook. Restarting Davis and saying "Check the weather in Detroit"
should now have an output like "The weather in Detroit is currently Mostly Cloudy with a temperature
of 42.4 degrees, and a Calm wind out of the West."