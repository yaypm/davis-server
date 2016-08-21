
![](https://s3.amazonaws.com/davis-project/dynatrace-davis-logo.png)

Welcome to the DAVIS project. You'll find comprehensive guides and documentation to help you start working with DAVIS as quickly as possible, as well as support if you get stuck. Let's jump right in!

We had fun building DAVIS and now it is your turn to enjoy the magic of DAVIS powered by the artificial intelligence of Dynatrace.

####Let's get started! - Prerequisites

1. Mongo Database installed with a fully qualified domain name (FQDN). This can be local or remote. You will want the database to persist for each iteration and version of DAVIS you upgrade to. [Check out this neat guide to get MongoDB setup on an AWS EC2 and Route53.](https://github.com/ruxit/davis-server/blob/master/setup/Create%20Mongo%20DB%20Instance.md)

#####Initialize DAVIS

1. Start a new project folder.
2. npm init and use the guide. Call your project davis-server.
3. (Optional) Version 1.0.0
4. (Optional) Description
5. (Required) Use default index.js. You will be creating this file later.
6. test command
7. (Required) Define the git respository. Right now since project is only 	available through private GitHub Repo you need access to Dynatrace 	Innovation lab (https://[username]@github.com/ruxit/davis-server.git#dev).


Before we initialize DAVIS you need to conifgure a few custom parameters for your environments. Make a copy of */demo/config.sample.js*. Please use the following sections as guidiance and direction on how to get your instance up and running.
TODO: How to configure the config.js file

####1. Default DAVIS Port : 3000
---

*This is the default port that davis will be available on. Set this to a desired port. DAVIS needs to be a secure endpoint so you will need to determine how you would like to do this. We prefer an Elastic Load balancer that can handle both a listening port, redirection, and HTTPS. We have chosen AWS's Elastic Beanstalk service to host DAVIS where ELB is native to out of the box configuration.*


####2. (Optional) NGINX Proxy
---

*Others have chosen to install a NGINX reverse proxy and a self signed certificate while developing*

####3. Mongo DB DSN Entry
---

*Once you have your Mongo Database configured and either have a IP or hostname available move replace the <mongodb_database_dsn> parameter with the one you obtained.*

####Watson Setup [More..](https://localpath/setup/Watson.md)
---

*You will need to obtain a Bluemix Username, Password, and token to be able to interact with the IBM Watson service that is powering the Speech To Text in the Web UI version of DAVIS. Navigate to [IBM Bluemix] (https://console.ng.bluemix.net/catalog/services/speech-to-text) and create a free IBM Bluemix acccount.*

####5. Slack Setup [More...](https://localpath/setup/Slack.md)
---

DAVIS isn't just voice. It's an Ecosytem. Follow the steps below to integrate DAVIS with your **#SLACK** account. We packed alot of cool features into our Slack configuration, but if you don't have an account set the **enabled** field to *false*. Once configured use a @davis to bring Dynatrace Platform intelligence to your preferred channel.

**6. Users**



**7. Alexa Tokens**

**8. Time Zones (Echo Only)**

**9. Token + Tenant**

**10. Wit Token**

**11. Aliases and their definitions.**

**12. TODO: npm install and save TODO: start davis**
