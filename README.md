
![](https://s3.amazonaws.com/davis-project/dynatrace-davis-logo.png)

Welcome to the DAVIS project. You'll find comprehensive guides and documentation to help you start working with DAVIS as quickly as possible, as well as support if you get stuck. Let's jump right in!

We had fun building DAVIS and now it is your turn to enjoy the magic of DAVIS powered by the artificial intelligence of Dynatrace.

####Let's get started! - Prerequisites

You will need a Mongo Database installed with a fully qualified domain name (FQDN).  This can be local to your DAVIS instance or remote. You will want the database to persist when upgrading to a new version of DAVIS. [Check out this guide to get MongoDB setup on an AWS EC2 and Route53.](https://github.com/Dynatrace/davis-server/blob/master/setup/Mongo.md)

You'll also need node.js version 4.X or newer.
#####Initialize DAVIS

1. Start a new project folder.
2. Run ````npm init ```` from the command line and give your project a unique name.
3. *(Optional)* Version 0.1.0
4. *(Optional)* Description
5. **(Required)** Use default index.js. You will be creating this file later
6. **(Required)** Define the git repository. Right now since project is only available through private GitHub Repo you need access to the Dynatrace Innovation lab (https://[username]@github.com/Dynatrace/davis-server.git#master)

Before you initialize DAVIS you need to configure a few custom parameters for your environments. Download a sample configuration from [here](https://github.com/Dynatrace/davis-server/blob/master/demo/config.sample.js) to the root of your project then rename the config file from 'config.sample.js' to 'config.js'.

Please use the following sections as guidance and direction on how to get your DAVIS instance up and running in only a few minutes.

**Table of Contents**

- [Accessing DAVIS](https://github.com/Dynatrace/davis-server#default-davis-port--3000)
- [NGINX Proxy](https://github.com/Dynatrace/davis-server#optional-nginx-proxy)
- [Mongo DSN](https://github.com/Dynatrace/davis-server#mongo-db-dsn-entry)
- [Dynatrace API](https://github.com/Dynatrace/davis-server#dynatrace-api)
- [Watson Setup](https://github.com/Dynatrace/davis-server#optional-watson-setup-more)
- [Slack Setup](https://github.com/Dynatrace/davis-server#optional-slack-setup-more)
- [Echo Setup](https://github.com/Dynatrace/davis-server#optional-echo-setup-more)
- [Defining Users](https://github.com/Dynatrace/davis-server#users)

---
####Default DAVIS Port : 3000
---

*3000 is the default port that DAVIS will be available on. Set this to a desired port (Default Node.js is 3000). DAVIS needs to be a secure endpoint so you will need to determine how you would like to do this. We prefer an AWS Elastic Load balancer that can handle both a listening port, redirection, and HTTPS. We have chosen AWS's Elastic Beanstalk service to host DAVIS where ELB is a native and out of the box configuration.*

````javascript
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',
````
---
####(Optional) NGINX Proxy
---

*You can install a NGINX reverse proxy and a self signed certificate for advanced routing. For example, you could have more than one DAVIS instance on the same server*.

---
####Mongo DB DSN Entry
---

*Once you have your Mongo Database configured and either have a IP or FQDN available replace the <mongodb_database_dsn> parameter with the one you obtained.*

````javascript
    // MongoDB connection string. For example, '127.0.0.1:27017/davis'
    database: {
        dsn: '<mongodb_database_dsn>'
    }
````
---
####Dynatrace API
---

*Enter your Dynatrace URL and access token.*  The Dynatrace URL should look similar to 'https://davis-demo.live.dynatrace.com' and the key can be created by logging into your environment and navigating to the following page https&#58;//{Your Dynatrace Domain Name}/#settings/integration/apikeys.  The strict SSL option should be set to true in more instances.

````javascript
    // The dynatrace URL and token
    // More information can be found here: https://help.dynatrace.com/api-documentation/v1/
    dynatrace: {
        url: '<tenant_url>',
        token: '<dynatrace_token>',
        // Optional - Set to false when using self signed certs
        strictSSL: true
    }
````

---
####Wit Token

Currently, you have two options when it comes to using Wit for NLP.  The first one is simply using our client token **6XTDF735VR2KUDVYTEOZZLIWHYOTDJXX**.  This token can be added to the configuration and used immediately.  Your second option is to download one our of Wit exports and create a new Wit application using our zip.  You then have full control over the phrases that trigger each intent.  Once your app is created, you can find your client token under the settings page.

````javascript
    nlp: {
        wit: '<wit_token>'
    }
````
####(Optional) Watson Setup [More..](https://github.com/Dynatrace/davis-server/blob/master/setup/watson.md)
---

Watson Speech to Text can be used anywhere there is a need to bridge the gap between the spoken word and its written form. This easy-to-use service uses machine intelligence to combine information about grammar and language structure with knowledge of the composition of an audio signal to generate an accurate transcription. It uses IBM's speech recognition capabilities to convert speech in multiple languages into text. The transcription of incoming audio is continuously sent back to the client with minimal delay, and it is corrected as more speech is heard.

*You will need to obtain a Bluemix username, password, and token to be able to interact with the IBM Watson service that is powering the Speech To Text in the Web UI version of DAVIS. Navigate to [IBM Bluemix] (https://console.ng.bluemix.net/) and create a free IBM Bluemix account.* Click [here](https://github.com/Dynatrace/davis-server/blob/master/setup/watson.md) for further instructions.

Simply keep watson set to false if you don't plan on using voice with the WebUI.

````javascript
    // Watson STT and TTS is only needed for the WebUI
    watson: {
        enabled: false,
        stt: {
            user: '<watson_stt_user_name>',
            password: '<watson_stt_password>'
        },
        tts: {
            user: '<watson_tts_user_name>',
            password: '<watson_tts_password>'
        }
    }
````
---
####(Optional) Slack Setup [More...](https://github.com/Dynatrace/davis-server/blob/master/setup/slack.md)
---
**Slack**: Be Less Busy; Brings all your communication together in one place. It's real-time messaging, archiving and search for modern teams. Bot users have many of the same qualities as their human counterparts: they have profile photos, names, and bios, they exist in the team directory, they can be direct messaged or mentioned, they can post messages and upload files, and they can be invited to and kicked out of channels and private groups.

DAVIS isn't just voice, it's an ecosystem. Follow the steps below to integrate DAVIS with your **#Slack** account. We packed a lot of cool features into our Slack bot configuration, but if you don't have an account, set the **enabled** field to *false*.  Click [here](https://github.com/Dynatrace/davis-server/blob/master/setup/slack.md) for further instructions.

````javascript
    // The Slack bot token can be created on the apps and integrations page
    slack: {
        enabled: true,
        key: '<slack_token>',
        notifications: {
            alerts: {
                enabled: true,
                channels: [
                    {
                        name: '<slack_channel_name>',
                        state: ['open', 'resolved'],
                        impact: ['application', 'service', 'infrastructure'],
                        tags: {
                            includes: [],
                            excludes: []
                        }
                    }
                ]
            }
        }
    }
````

![](https://s3.amazonaws.com/davis-project/docs/davis-slack-examples.png)

---
####(Optional) Echo Setup [More...](https://github.com/Dynatrace/davis-server/blob/master/setup/echo.md)

Amazon Echo is a hands-free speaker you control with your voice. Echo connects to the Alexa Voice Service to play music, provide information, news, sports scores, weather, and more—instantly. Wouldn't it be great to have your Echo provide you application and digital performance problems and updates? Assist you in finding the root cause of an Application problem? Wait no more! First, jump over to [Amazon.com](https://www.amazon.com/dp/B00X4WHP5E) and order yourself an Echo, Echo Tap, Echo DOT, or even a FireTV and follow the instructions [here](https://github.com/Dynatrace/davis-server/blob/master/setup/echo.md).

````javascript
    // The Alexa ID is generated by Amazon when you configure your Alexa app.
    alexa: [{
        id: '<alexa_token>',
        name: {
            first: '<first_name>',
            last: '<last_name>'
        },
        // Canonical timezone (see below)
        timezone: 'America/Detroit'
    }]
````

When configuring an Echo user you will need to manually set the Canonical time zone of the Echo device being used.  You can find a list of valid Canonical IDs [here](http://joda-time.sourceforge.net/timezones.html).

---
####(Optional) Aliases and Friendly Names

Dynatrace is really good at understanding the architecture of your application right out of the box. It automatically names applications, services and instances based on a number of factors. While this is great, it doesn't always look or sound that nice when DAVIS uses the raw value in it's response.  However, you can assist DAVIS’s pronunciation of these assets with configurable aliases.

For example:

Application Server - 0000001 can be renamed Application Server One.

You will find a placeholder configuration near the bottom of the [config.js](https://github.com/Dynatrace/davis-server/blob/master/demo/config.sample.js) you downloaded in a previous set.  The name should be the same as what you see in Dynatrace.  Audible and visual are used automatically when creating the response.  The aliases array is used to help match a received input.  Typically this would be useful when attempting to match a spoken phrase with an entity found in Dynatrace.  For example, you may have an application named easyTravel.  However, Alexa and Watson will hear that as easy travel.  Having easy travel in the alias array would help match that phrase with the appropriate entity.

````javascript

    aliases: {
        applications: [{
            name: 'easyTravel',
            display: {
                audible: 'Easy Travel',
                visual: 'easyTravel'
            },
            aliases: ['easy travel']
        }],
        services: [{
            name: 'easyTravelDB',
            display: {
                audible: 'easy travel database',
                visual: 'easyTravel DB'
            },
            aliases: ['db', 'database']
        }],
        infrastructure: [{
            name: 'easyTravel host 1',
            display: {
                audible: 'easy travel host 1',
                visual: 'easyTravel host 1'
            },
            aliases: []
        }]
    }
````

---

####Install & Start DAVIS Server

OK, now that you've made it this far, it's time for the fun part.  Create or open index.js at the root of your project.  Now paste in the following code:

````javascript
    "use strict"
    
    const DavisServer = require('davis-server'),

    try {
        const davisServer = new DavisServer(require('./config'));

        davisServer.run();
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
````

You should simply be able to run:
````bash
    node ./index.js
````
---
