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

While Heroku offers a generous free tier, it's not recommends for Davis.  Feel free to use it while you're evaluating but the hobby tier is recommended for production use.  This is mainly because the free tier goes to sleep after 30 minutes of inactivity and the startup process is relativity slow.

### AWS - Cloud Computing services

Coming soon!

## Configuration

- [Alexa](setup/alexa.md)
- [Slack](setup/slack.md)

## Management

A configuration UI is currently in the works!  Until then, please have a look at our [REST API docs](development/API.md).