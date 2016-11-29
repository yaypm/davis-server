Getting Started
============

## Prerequisites

- **linux** - tested on Heroku and Amazon Linux (2016.09)
- **git**
- **Node.js** - (6.x or newer) installed
- **MongoDB** - installed with a [fully qualified domain name (FQDN)](https://kb.iu.edu/d/aiuv). This can be on the same server as your Davis instance (local) or on another server (remote). Guides: [AWS: EC2 instance with Route53](setup/mongo.md) or [Cloud9](https://community.c9.io/t/setting-up-mongodb/1717).  The MongoLab addon removes this requirement if you're using Heroku.
- **Valid Certificate** - Davis communicates with a number of different services.  It's required that this connection is secured with a valid cert.
- **Publicly accessible endpoint** - This is required for both Slack and Alexa support.

## Deploy

### Heroku - Cloud Platform-as-a-Service PaaS provider
#### Button
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/Dynatrace/davis-server)

By far the simplest way to get started with Davis is to simply click the "Deploy to Heroku" button.  This will automatically grab the latest version of Davis, provision a MongoDB instance, and start the server.  From there, you can configure Davis via the configuration UI.

#### CLI

It's also possible to deploy to Heroku using their CLI.

* Clone this repo and change directory to it
* Log in with the [Heroku Toolbelt](https://toolbelt.heroku.com/) and create an app: `heroku create`
* Use the [mLab addon](https://elements.heroku.com/addons/mongolab): `heroku addons:create mongolab:sandbox --app YourAppName`
* Deploy with the following command: `git push heroku master`

#### Limitations

While Heroku offers a generous free tier, it is not recommended for Davis.  Feel free to use it while you're evaluating but the hobby tier is recommended for production use.  This is mainly because the free tier goes to sleep after 30 minutes of inactivity and the startup process is relativity slow.

### AWS - Cloud Computing services

Coming soon!

## Configuration

- [Alexa](setup/alexa.md)
- [Slack](setup/slack.md)

## Management

A configuration UI is currently in the works!  Until then, please have a look at our [REST API docs](development/API.md).

## Basic Usage

Here are a few example interactions to get you started with Davis.

### Basic Time Range query

> Alexa, start davis.

> How can I be of service?

> What happened yesterday?

> I hate to be the bearer of bad news, but there were 15 problems detected yesterday between
12:00 AM and 11:59 PM. However, I would recommend focusing on one of the following problems. First
off, there was a global outage for synthetic based web checks, which affected Jerry -
easytravel.demo.dynatrace dot com:8080/, but it closed around 6:40 AM. Next, there was a global
outage for synthetic based web checks, which affected easyTravel demo booking, but was resolved
yesterday around 1:05 AM. Finally, there was a global outage for synthetic based web checks, which
affected easyTravel demo booking, but it closed yesterday around 2:40 AM. Would you be interested in
hearing more about the first, second, or third problem?

> The third one

> This problem started yesterday around 2:00 AM when a global outage for synthetic based web checks
started impacting easyTravel demo booking. This problem appears to be resolved now. However, I would
recommend investigating the root cause of this problem to see if there's a way to avoid this in the
future. Is there anything else I can help you with?

> No

> Ok, Have a good one!

### Specific Application Query

> Alexa, start davis.

> How can I be of service?

> What happened yesterday with my fancy application?

> There was a series of connectivity failures that affected my fancy application.  This problem
started yesterday around 3 AM but was resolved yesterday around 3:30 AM. Would you like me to
analyze this further for you?

> No

> Ok, Have a nice day!
