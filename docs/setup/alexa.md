## Amazon Echo Configuration and UserID

- [Navigate to Amazon's Alexa Service](#1---navigate-to-amazons-alexa-service)
- [Select Alexa](#2---select-alexa)
- [Get Started](#3---get-started)
- [Add A New Skill](#4---add-a-new-skill)
- [Name Your Skill](#5---name-your-skill)
- [Configure Intent Schema - Pass Through](#6---configure-intent-schema---pass-through)
- [Configure Sample Utterances - Pass Through](#7---configure-sample-utterances---pass-through)
- [Add Your Davis Endpoint](#8---add-your-davis-endpoint)
- [Configure Security](#9---configure-security)
- [Obtain Echo UserID from Sample Request](#10---obtain-echo-userid-from-sample-request)

***
### 1 - Navigate to Amazon's Alexa Service
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-1.png)
***
### 2 - Select Alexa
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-2.png)
***
### 3 - Get Started
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-3.png)
***
### 4 - Add A New Skill
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-4.png)
***
### 5 - Name Your Skill

> The *Invocation Name* is the keyword heard by your Echo device that prompts the Alexa service to use your Davis skill.

![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-5.png)
***
### 6 - Configure Intent Schema - Pass Through

> This allows Alexa to pass through content heard on the Echo device through to your Davis service.

![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-6-2.png)

#Intent Schema
````javascript
{
    "intents": [
        {
            "intent": "DoCommand",
            "slots": [
                {
                    "name": "command",
                    "type": "LITERAL"
                }
            ]
        }
    ]
}
````
***
### 7 - Configure Sample Utterances - Pass Through

![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-7.png)

````javascript
DoCommand {script parameters|command}
````
***
### 8 - Add Your Davis Endpoint
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-8.png)

>If you launched this using our Heroku integration this will be your dyno application url. Selecting Open app.

![Heroku Open App](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/heroku-open-app.png)

***
### 9 - Configure Security
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-9.png)

>If you launched this using our Heroku integration a certificate is automatically generated and your dyno application is secure. This is one of the great benefits of using this integration. We know that managing certificates can be challenging. Selecting the 2nd option will use the automatically generated certificate.

***
### 10 - Obtain Echo UserID from Sample Request
![Alexa Homepage](https://s3.amazonaws.com/dynatrace-davis/assets/images/docs/alex-token-10.png)

***

> Use this UserID in step four (4) of the configuration wizard.
> **Note:** Davis REST endpoints are available to add additional devices to Davis. In the next release of Davis you will be able to add these in the Davis UI.