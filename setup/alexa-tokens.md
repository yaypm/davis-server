
###1 - Navigate to Amazon's Alexa Service
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-1.png)
***
###2 - Select Alexa
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-2.png)
***
###3 - Get Started
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-3.png)
***
###4 - Add A New Skill
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-4.png)
***
###5 - Name Your Skill

> The *Invocation Name* is the keyword heard by your Echo device that prompts the Alexa service to use your DAVIS skill.

![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-5.png)
***
###6 - Configure Intent Schema - Pass Through

> This allows Alexa to pass through content heard on the Echo device through to your DAVIS service.

![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-6-2.png)

````
#Intent Schema

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
###7 - Configure Sample Utterances - Pass Through

![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-7.png)

````
DoCommand {script parameters|command}
````
***
###8 - Add Your DAVIS Endpoint 
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-8.png)
***
###9 - Configure Security
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-9.png)

***
###10 - Obtain Echo UserID from Sample Request
![Alexa Homepage](https://s3.amazonaws.com/davis-project/docs/alex-token-10.png)

***

> Use this UserID in your config.js file when defining new users.
