module.exports.requests = {
    // LaunchRequest template
    "launch": {
        "version": "1.0",
        "session": {
            "new": true,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA"
            }
        },
        "request": {
            "type": "LaunchRequest",
            "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423",
            "timestamp": "2015-05-13T12:34:56Z"
        }
    }
    // IntentRequest template
    ,
    "intent": {
        "version": "1.0",
        "session": {
            "new": false,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA"
            }
        },
        "request": {
            "type": "IntentRequest",
            "requestId": "amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
            "timestamp": "2015-05-13T12:34:56Z",
            "intent": {
                "name": "",
                "slots": {}
            }
        }
    }
    // SessionEndedRequest template
    ,
    "session_end": {
        "version": "1.0",
        "session": {
            "new": false,
            "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
            "application": {
                "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
            },
            "attributes": {},
            "user": {
                "userId": "amzn1.echo-sdk-account.AHIGWMSYVEQY5XIZIQNCTH5HZ5RW3JK43LUVBQEG6IM6B73UA5CLA"
            }
        },
        "request": {
            "type": "SessionEndedRequest",
            "requestId": "amzn1.echo-api.request.d8c37cd6-0e1c-458e-8877-5bb4160bf1e1",
            "timestamp": "2015-05-13T12:34:56Z",
            "reason": "USER_INITIATED"
        }
    }
};