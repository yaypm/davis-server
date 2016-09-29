
###Slack Configuration

Go to **[#Slack](https://api.slack.com/bot-users)** and start to create your davis bot. Your goal is to obtain a BOT API Token.

![Slack Bot Image](https://s3.amazonaws.com/davis-project/docs/slack-bot-create.png)

*Note the warning from Slack

Once you have obtained a token apply it in your configuration file.

````javascript

slack: {
        enabled: true, //set this to false if you don't have a SLACK account.
        key: '<slack_token>'
    },
````
