**Push notification in Slack**

It's possible to route Dynatrace problem notifications through Davis.  This is handy because it allows you to easily define what channels receive what notifications.

*Prerequisites*
- Your Dynatrace environment must be able to communicate with your Davis server.
- Davis must be accessible via port 443 with a valid SSL cert
- [Slack configured in Davis](https://github.com/Dynatrace/davis-server#slack-setup-more)

*Configuring Dynatrace to push problem notifications*

l. login to https://signin.dynatrace.com
2. Navigate to Settings > Integration > Problem Notifications
3. Click "Set up notifications"
4. Click "Custom integration"
5. Name your new integration
6. Define the Webhook URL.  For example, https&#58;//{Your Davis URL}/api/v1/events/problems
7. Replace the custom JSON payload section with:
<code>
{
    "PID":"{PID}",
    "ProblemID":"{ProblemID}",
    "State":"{State}",
    "ProblemImpact":"{ProblemImpact}",
    "ProblemURL":"{ProblemURL}",
    "ImpactedEntity":"{ImpactedEntity}",
    "Tags":"{Tags}"
}
</code>
8. Enable all notification levels
9. Click "Test"
10. Click "Save"

*Configuring Davis to route problems to Slack*

Take a look at the config.js file at the root of your project.  There is a slack section with some skeleton notification configurations.

It should looke similar to this:
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

Notice that channels is an array.  You can add a number of different channels to this list and filter them in any way you like.

The slack channel name can be any channel that Davis has been invited to.  Please to not include the pound # symbol when defining a channel name. 

Now all you need to do remove values from the state and impact arrays if you aren't interested in problems that fall under those categories.

Lastly, you can define optional tags that should be taken under consideration.  If you aren't aware, tags can be applied to nearly all applications, services and hosts in Dynatrace.  Dynatrace will send all the tags associated with the affected entities in a problem web hook.  Only a single tag needs to match and problems that contain any tags in the exclusion list are always ignored.