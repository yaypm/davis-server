
![](https://s3.amazonaws.com/davis-project/dynatrace-davis-logo.png)

Welcome to the DAVIS project. You'll find comprehensive guides and documentation to help you start working with DAVIS as quickly as possible, as well as support if you get stuck. Let's jump right in!

We had fun building DAVIS and now it is your turn to enjoy the magic of DAVIS powered by the artificial intelligence of Dynatrace.

**Let's get started! - Prerequisites**

1. Mongo Database installed with a fully qualified domain name (FQDN). This can be local or remote. You will want the database to persist for each iteration and version of DAVIS you upgrade to. [Check out this neat guide to get MongoDB setup on an AWS EC2 and Route53.](https://github.com/ruxit/davis-server/blob/master/setup/Create%20Mongo%20DB%20Instance.md)


**Initialize DAVIS**

1. Start a new project folder.
2. `npm init` and use the guide. Call your project **davis-server**.
3. (Optional) Version 1.0.0
4. (Optional) Description
5. (Required) Use default index.js. You will be creating this file later. 
6. **??**test command
7. (Required) Define the git respository. Right now since project is only available through private GitHub Repo you need access to Dynatrace Innovation lab (https://[`username`]@github.com/ruxit/davis-server.git#dev). 


TODO: How to configure the config.js file

 1. Default DAVIS Port : 3000
 2. (Optional) NGINX Proxy
 3. Mongo DB DSN Entry
 4. Watson
 5. Slack
 6. Users
 7. Alexa Tokens
 8. Time Zones
 9. Token + Tenant
 10. Wit Token *Need to export Wit Template and add to git repo
 10. Aliases and their definitions.

TODO: npm install and save
TODO: start davis
