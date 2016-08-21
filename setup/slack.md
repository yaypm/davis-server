
###Slack Configuration

1. Go to **[#Slack](https://api.slack.com/bot-users)** and start to create your davis bot. Your goal is to obtain a BOT API Token.

2. Once you have obtained a token apply it in your configuration file.

````javascript

slack: {
        enabled: true, //set this to false if you don't have a SLACK account.
        key: '<slack_token>'
    },
````
