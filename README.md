
![](https://s3.amazonaws.com/davis-project/dynatrace-davis-logo.png)

Welcome to the DAVIS project. You'll find comprehensive guides and documentation to help you start working with DAVIS as quickly as possible, as well as support if you get stuck. Let's jump right in!

In many of of the teaser trailers of Dynatrace, Dynatrace has a persona. We have developed an idea that makes that a reality. Our idea was to extend the Dynatrace Platform reach beyond the desktop to capture and process speech in order to respond accurately and appropriately.

We have been to the front lines and back and have been witness to the rudimentary questions that we 'ask' the Dynatrace's Platform to provide us on a daily basis. We believe that these can be channeled through a voice operating system.

What happened at?
What is happening right now?
What is the overall response time of our application? In each geography?
What is our conversion rate?
How many mobile users?

While some of the questions we ask are simple, finding the answers can prove to be quite difficult. And with the introduction of the Dynatrace Problem feed there is now an infinite number of questions that a business owner or DevOps engineer can 'ask'. For those that have time to learn the solution these answers are fairly easy to find, but for those individuals that need quick answers, or want to know something about their application instantaneously we would like to introduce DAVIS (Dynatrace Automated Voice Integration Service). DAVIS is now the first voice enabled assistant that can retrieve and deliver digital performance management information about your most complex, full stack, and cloud native applications.

With zero exposure or training you are able to understand the health of your application. This technology stack uses the Alexa Skills Kit and our Problem Feed. We have built a PoC leveraging these technologies to take care of the simple questions that one might want to know about their application. The who, what, when, and where of the problems that exist in development and operations. At a moments notice you can freely ask DAVIS to retrieve the information you are looking for and have a conversation with Dynatrace.

Instead of logging in and launching Dynatrace (davis can do that too) we have reduced the process to simply asking the thin air surrounding you, a simple command in Slack, or natively in DAVIS,  and it will respond with what you are looking for. Your very own virtual personal assistant with Dynatrace AI as it's core.

Imagine a few different scenarios:

You walk into your office in the morning and ask DAVIS if anything noteworthy happened last night. DAVIS would automatically contact the Dynatrace Platform to gather data for the appropriate response.

The device could light up when Ruxit detects a problem. You ask "Ruxit, what's up?". DAVIS then could respond with the problem that Ruxit detected along with a possible root cause. You could then ask DAVIS to let you know if the situation changes.

You could start asking ad hoc questions like "DAVIS, what's up" or "DAVIS, what happened yesterday at 8am?" and DAVIS will respond appropriately based on the health of your application. If you are lucky, davis might even tell you a story about your application problems. They can be very enlightening!

Our current PoC demonstrates that the examples above are possible. Even better, this is only the beginning. We could keep extending the functionality to include more commands over time.

With your help we can extend DAVIS beyond just our Platform problem feed and start to create an ecosystem. We all remember the famous clip from the Matrix when Neo learns Kung Fu. The same applies here. Drop in a #Slack, HipChat, Salesforce.com, or your very own custom built skill, and DAVIS will take care of the rest. 

We had fun building DAVIS and now it is your turn to enjoy the magic of DAVIS powered by the artificial intelligence of Dynatrace.

**Let's get started! - Prerequisites**

1. Mongo Database installed with FQN address. This can be local or remote. You will want the database to persist for each iteration and version of DAVIS you upgrade to. [Check out this neat guide to get MongoDB setup on an AWS EC2 and Route53.](https://github.com/ruxit/davis-server/blob/master/setup/Create%20Mongo%20DB%20Instance.md)


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