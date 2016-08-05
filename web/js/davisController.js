var davisController = (function() {

// Globals
var isMuted = true;                       // No STT
var muteButtonPressed = false;            // Prevent automatically unmutting if mute button is pressed
var listeningState;                       // 
var inactivityTimeout = 1;                // Seconds of silence before Watson STT API stops listening
var momentsOfSilence = 0;                 // Used for polling number of moments of silence 60 ms apart (avoid cutting off TTS playback) 
var player = new Audio();                 // Audio element used to play TTS audio
var micOn = new Audio('./audio/pop.wav'); // Mic on sound effect
var stream;                               // IBM STT stream
var outputQueueSize = 0;                  // Counter for keeping track of queued outputTextAndSpeech() calls
var timezone;                             // User's timezone
var userToken;                            // Random token used in place of a user ID to store/retrieve conversations in web version
var listenAfter = true;                   // Make Watson listen after outputting a response

var listeningStateEvents = {
    sleeping: new Event('sleeping'),
    enablingMic: new Event('enablingMic'),
    listening: new Event('listening'),
    processing: new Event('processing'),
    responding: new Event('responding'),
    silentMode: new Event('silentMode')
}

// Listening state event handlers
document.addEventListener('sleeping', function (event) {
    listeningState = 'sleeping';
    davisView.setListeningState(listeningState);
}, false);

document.addEventListener('enablingMic', function (event) {
    listeningState = 'enablingMic';
    davisView.setListeningState(listeningState);
}, false);

document.addEventListener('listening', function (event) {
    listeningState = 'listening';
    davisView.setListeningState(listeningState);
}, false);

document.addEventListener('processing', function (event) {
    listeningState = 'processing';
    davisView.setListeningState(listeningState);
    davisView.resetTextInput();
}, false);

document.addEventListener('responding', function (event) {
    listeningState = 'responding';
    davisView.setListeningState(listeningState);
}, false);

document.addEventListener('silentMode', function (event) {
    listeningState = 'silentMode';
    davisView.setListeningState(listeningState);

    if (!isMuted) {
        toggleMute(true);
    }
    
    enableListenForKeyword(false);
}, false);


// Speech-To-Text (STT) & Text-To-Speech (TTS) token objects
var savedSttTokenObj = {
    'token': '',
    'expiration': new Date()
};
var savedTtsTokenObj = {
    'token': '',
    'expiration': new Date()
};

/**
 * interactWithRuxit() sends a request to be processed for its intent 
 * in order to interact with the Ruxit API (provides APM metrics)
 * 
 * @param {String} request
 */
function interactWithRuxit(request) {

    if (request === '' && inactivityTimeout === 2) {
        document.dispatchEvent(listeningStateEvents.silentMode);
    } else if (request === '') {
        toggleMute(true);
        inactivityTimeout = 2;
    } else {
        inactivityTimeout = 1;
    }

    davisView.muted();
    document.dispatchEvent(listeningStateEvents.processing);

    if (request) {

        davisView.addToInteractionLog(request, false, false);
    
        var date = new Date();
    
        var input = {
            sessionId: 'websession-' + date.getDate() + date.getMonth() + date.getFullYear(),
            request: request,
            user: userToken,
            timezone: timezone
        };
    
        var options = {
            method: 'post',
            mode: 'cors',
            body: JSON.stringify(input),
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        };

        fetch('/web', options)
        .then(function (response) {
            
            return response.json();
            
        }).then(function (data) {
            
            if (!data.response.text) {
                
                outputTextAndSpeech(localResponses.errors.nullResponse, localResponses.voices.michael, false);
                return;
                
            } else if (!data.response) {
                
                document.dispatchEvent(listeningStateEvents.sleeping);
                return;
                
            }
    
            if (data.response) {
                
                outputTextAndSpeech(data.response.text, localResponses.voices.michael, !data.response.shouldEndSession);
                
                // "Show me" hyperlink push functionality
                if (data.response.hyperlink) {
                    window.open(data.response.hyperlink, '_blank').focus();
                }
                
            } else {
                document.dispatchEvent(listeningStateEvents.sleeping);
            }
            
        }).catch(function (err) {
            outputTextAndSpeech(localResponses.errors.server, localResponses.voices.michael, false);
            console.log('interactWithRuxit - Error: ' + err);
        });
    } else {
         document.dispatchEvent(listeningStateEvents.sleeping);
    }
}

/**
 *  outputTextAndSpeech() forwards text to be added to the interaction log and be spoken
 * 
 * @param {String} text
 * @param {String} voice
 * @param {Boolean} listen
**/
function outputTextAndSpeech(text, voice, listen) {
    
    document.dispatchEvent(listeningStateEvents.responding);
    
    listenAfter = listen;

    getTtsToken().then(function (token) {

        if (isPlaying()) {
            
            playWhenDonePlaying(text, token, voice);
            
        } else {
            
            speak(text, token, voice);
            
        }

    }).then(function () {
        
        if (!isMuted) {
            
            outputQueueSize++;
            unmuteWhenDonePlaying();

        }
        
    });
}

/**
 * getDavisUserToken() returns a token with no expiration
 * for storing and retrieving conversation history
 * The token is stored client-side in localStorage
 * 
 * @return {String} token 
 */ 
function getDavisUserToken() {
    
    // Attempt to retrieve token from localStorage
    userToken = localStorage.getItem("davis-user-token");
    
    if (!userToken) {
        
        var options = {
            method: 'get',
            headers: {
              accept: 'text/plain'
            }
        };
        
        fetch('/web/token', options)
        .then(function (response) {
            return response.text();
        }).then(function (resp) {
            localStorage.setItem("davis-user-token", resp);
            userToken = resp;
        })
        .catch(function (err) {
            console.log(err);
        });
        
    }
    
}

/**
 * getTtsToken() returns a token for use with IBM Watson TTS
 * 
 * IBM Watson tokens have a time to live (TTL) of one hour, 
 * so we will refresh the token every 59 minutes to be safe
 * 
 * @return {String} savedTtsTokenObj.token
 */
function getTtsToken() {
    
    var options = {
        method: 'get',
        mode: 'cors'
    };

    if (savedTtsTokenObj.token != '' && savedTtsTokenObj.expiration > new Date((new Date) * 1 - 1000 * 3500)) {

        return savedTtsTokenObj.token;

    } else {
        
        return fetch('/api/v1/watson/tts/token', options)
        .then(function (response) {
        
            // Save new token
            savedTtsTokenObj.expiration = new Date();
            savedTtsTokenObj.token = response.text();
        
            return savedTtsTokenObj.token;
          
        });
      
    }
    
}

/**
 * getSttToken() returns a token for use with IBM Watson TTS
 * 
 * IBM Watson tokens have a time to live (TTL) of one hour, 
 * so we will refresh the token every 59 minutes to be safe
 * 
 * @return {promise} savedSttTokenObj.token 
 */
function getSttToken() {
    
    return new Promise(function (resolve, reject) {

        var options = {
            method: 'get',
            mode: 'cors'
        };

        if (savedSttTokenObj.token != '' && savedSttTokenObj.expiration > new Date((new Date) * 1 - 1000 * 3500)) {

            resolve(savedSttTokenObj.token);

        } else {

            fetch('/api/v1/watson/stt/token', options)
            .then(function (response) {
    
                // Save new token
                savedSttTokenObj.expiration = new Date();
                savedSttTokenObj.token = response.text();
                
                // Check if mic is detected by browser API
                var gum = navigator && navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                gum.call(navigator, { audio: true }, function () { resolve(savedSttTokenObj.token); }, function () { noMic(); reject(new Error('No Mic')); });
    
            })
            .catch(function (err) {
                reject(err);
            });

        }

        if(!muteButtonPressed) {
            davisView.listening();
            micOn.play();
        }
        
    });
    
}

/**
 * createSttStream() helps setup an audio capture stream for IBM Watson STT API
 * 
 * Requires a token provided by IBM
 * 
 * @param {String} token
 */
function createSttStream(token) {
    
    return new Promise(function (resolve, reject) {

        stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
            token: token,
            keepMic: true,
            outputElement: '#textInput'
        });

        stream.on('error', function (err) {
            console.log(err);
        });
        
        document.dispatchEvent(listeningStateEvents.listening);

    });
    
}

/**
 * speak() forwards text and a token for use with IBM Watson TTS API
 * 
 * @param {String} text
 * @param {String} token
 * @param {String} voice
 */
function speak(text, token, voice) {
    
    if (listeningState !== 'silentMode') {
        
        player.onplay = function () {
            davisView.addToInteractionLog(text, true, true);
        };
        
        WatsonSpeech.TextToSpeech.synthesize({
            text: text,
            token: token,
            voice: voice,
            element: player
        });
        
    } else {
        
        davisView.addToInteractionLog(text, true, false);
        
    }
    
}

/**
 * isPlaying() returns whether TTS audio is being played
 * 
 * @return {Boolean}
 */
function isPlaying() {
    return !(player.ended || player.paused);
}

/**
 * unmuteWhenDonePlaying() enables the mic when done playing TTS audio
 * 
 */
function unmuteWhenDonePlaying() {
    
    if (isPlaying()) {
        
        var timeout = setTimeout(unmuteWhenDonePlaying, 60);
        
    } else {
        
        clearTimeout(timeout);
        
        if (momentsOfSilence >= 1) {
            
            momentsOfSilence = 0;
            outputQueueSize--;
            
            if (outputQueueSize < 1 && listeningState !== 'silentMode' && !muteButtonPressed && listenAfter) {
                
              listen();
              
            } else if (!listenAfter) {
                toggleMute(true);
                enableListenForKeyword(true);
            } else {
                muteButtonPressed = false;
            }
            
        } else {
            
            momentsOfSilence++;
            var timeout = setTimeout(unmuteWhenDonePlaying, 60);
            
        }
        
    }
    
}

/**
 * playWhenDonePlaying() forwards text and a token for use with IBM Watson TTS API 
 * when all previous TTS audio is done playing
 * 
 * @param {String} text
 * @param {String} token
 */
function playWhenDonePlaying(text, token, voice) {
    
    if (isPlaying()) {
        
        var timeout = setTimeout(function () { 
            playWhenDonePlaying(text, token, voice); 
        }, 50);
        
    } else {
        
        clearTimeout(timeout);
        speak(text, token, voice);
        
    }
    
}

/**
 * listen() interacts with the IBM Watson STT API
 * when there's no interaction in progress already
 */
function listen() {
    
    if (listeningState !== localResponses.listeningStates.listening 
        && listeningState !== localResponses.listeningStates.silentMode) {

        getSttToken()
        .then(function (token) {
            createSttStream(token);
        })
        .catch(function (err) { 
            console.log(err); 
        });
      
    }
    
}

/**
 * annyangInit() initializes the annyang STT library for use as a key phrase listener 
 *
 * Uses SpeechRecognition browser API (Chrome and Firefox supported)
 */
function annyangInit() {
    
    if (annyang) {

        annyang.addCallback('result', function (phrases) {
            if (phrases[0].toLowerCase().includes('hey davis') || phrases[0].toLowerCase().includes('ok davis')) {
                document.dispatchEvent(listeningStateEvents.enablingMic);
                listenAfter = true;
                toggleMute(false);
            }
            
        });
        annyang.setLanguage('en');

    }
    
}

/**
 * enableListenForKeyword() enables or disables the 
 * annyang STT library (used for listening for key phrases)
 * 
 * Used when toggling between the annyang STT library and IBM Watson STT API
 */
function enableListenForKeyword(listen) {
    listen ? annyang.start({ 'autoRestart': true, 'continuous': true }) : annyang.abort();
}

/**
 * toggleMute() toggles the mic on/off
 * 
 * Unless in silent mode, mic off mode 
 * still listens for key phrases with annyang
 * 
 * @param {Boolean} mute
 */
function toggleMute(mute) {
    
    listenAfter = true;
    
    if (!isMuted && mute == undefined && !muteButtonPressed) {
        muteButtonPressed = true;
    } else {
        muteButtonPressed = false;
    }
    
    if ((!isMuted && mute != false) || muteButtonPressed) {
        
        isMuted = true;
        document.dispatchEvent(listeningStateEvents.sleeping);
        davisView.muted();
        
        if (stream != null) {
            stream.stop();
        }
        
        enableListenForKeyword(true);
        
    } else {
        
        isMuted = false;
        document.dispatchEvent(listeningStateEvents.sleeping);
        davisView.listening();
        enableListenForKeyword(false);
        unmuteWhenDonePlaying();
        
    }
    
}

/**
 * noMic() accounts for cases where no mic browser API is detected (error handeling)
 */
function noMic() {
    
    document.dispatchEvent(listeningStateEvents.silentMode);
    speak(localResponses.errors.noMic);
    davisView.noMic();
    davisView.muted();
    
}

/**
 * init() is a global initializer (called via onload) 
 */
function init() {
    
    davisView.resetPlaceholder();
    
    if (typeof window.chrome != 'object') {
        
        document.dispatchEvent(listeningStateEvents.silentMode);
        davisView.noMic();
        davisView.muted();
        davisView.addToInteractionLog(localResponses.errors.noBrowserSupport, true, false);
        davisView.addToInteractionLog(localResponses.errors.chrome, true, false);
        davisView.addToInteractionLog(localResponses.errors.getChrome, true, false); 
        
    } else {
        
        timezone = jstz.determine().name();
        
        if (!localStorage.getItem("davis-user-token")) {
            davisView.addToInteractionLog(localResponses.greetings.micPermission, true, false);
            davisView.addToInteractionLog(localResponses.greetings.thenHelp, true, false);
        } else {
            davisView.addToInteractionLog(localResponses.greetings.help, true, false);
        }
        
        getDavisUserToken();
        annyangInit();
        enableListenForKeyword(true);
        document.dispatchEvent(listeningStateEvents.sleeping);
    }
    
}

// Global methods
return {
    
    getInactivityTimeout: function () {
        return inactivityTimeout;
    },
    enableListenForKeyword: function (listen) {
        enableListenForKeyword(listen);
    },
    enableSilentMode: function () {
        document.dispatchEvent(listeningStateEvents.silentMode);
    },
    init: function () {
        init();
    },  
    interactWithRuxit: function (input) {
       interactWithRuxit(input); 
    },
    submitTextInput: function (keycode) {
        submitTextInput(keycode);
    },
    toggleMute: function () {
        toggleMute();    
    }
    
}

})()