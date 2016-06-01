var express = require('express');
var router = express.Router();


router.post('/', function(req, res, next) {
   
    console.log('Starting to process an Alexa request');
    
});

/*
if (context.functionName === 'serverless-alexa' || context.functionName ===  'alexa'){
        //ToDo validate that this request is actually from Alexa
        console.log('Starting to process an Alexa request');
        processedEvent.sessionId = event.session.sessionId;
        processedEvent.intent = event.request.type;
        processedEvent.eventSource = 'alexa';
        //ToDo handle launch intents
        if (event.request.type === 'LaunchRequest'){
            console.log('Responding to a launch request');
            //ToDo look into fixing this
            processedEvent.request = 'let\'s get started';
            
        } else if (event.request.type === 'IntentRequest'){
            processedEvent.request = event.request.intent.slots.command.value;
        } else if (event.request.type === 'SessionEndedRequest'){
            // Alexa is just letting us know it killed the session.
            console.log('Session end request because of ' + event.request.reason);
            context.done(null, {});
            return;
        } else {
            console.log('I don\'t know...');
        }
    } else if(context.functionName === 'serverless-slack' || context.functionName === 'slack'){
        console.log('Starting to process a Slack request');
        if(!event.sessionId || !event.request){
            return context.done(null, {error: 'A session ID and request are required'});
        }
        processedEvent.sessionId = event.sessionId;
        processedEvent.request = event.request;
        processedEvent.eventSource = 'slack';
    }
*/

module.exports  = router;