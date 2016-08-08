var davisController = (function () {

var isMuted = true;                       // No STT
var muteButtonPressed = false;            // Prevent automatically unmutting if mute button is pressed
var inactivityTimeout = 1;                // Seconds of silence before Watson STT API stops listening
var momentsOfSilence = 0;                 // Used for polling number of moments of silence 60 ms apart (avoid cutting off TTS playback) 
var player = new Audio();                 // Audio element used to play TTS audio
var micOn = new Audio('./audio/pop.wav'); // Mic on sound effect
var stream;                               // IBM STT stream
var outputQueueSize = 0;                  // Counter for keeping track of queued outputTextAndSpeech() calls
var timezone;                             // User's timezone
var userToken;                            // Random token used in place of a user ID to store/retrieve conversations in web version
var listenAfter = true;                   // Make Watson listen after outputting a response
var debug = false;                        // Debug mode

if (localStorage.getItem('davis-debug-mode')) {
    debug = localStorage.getItem('davis-debug-mode');
    console.log('Davis: debug = ' + debug);
}

// Speech-To-Text (STT) & Text-To-Speech (TTS) token objects
var savedSttTokenObj = {
    'token': '',
    'expiration': new Date()
};
var savedTtsTokenObj = {
    'token': '',
    'expiration': new Date()
};


// Listening state events and handlers
var listeningState;

var listeningStateEvents = {
    sleeping: new Event('sleeping'),
    enablingMic: new Event('enablingMic'),
    listening: new Event('listening'),
    processing: new Event('processing'),
    responding: new Event('responding'),
    chatMode: new Event('chatMode')
}

document.addEventListener('sleeping', function (event) {
    listeningState = 'sleeping';
    davisView.setListeningState(listeningState);
    davisView.muted();
}, false);

document.addEventListener('enablingMic', function (event) {
    listeningState = 'enablingMic';
    davisView.setListeningState(listeningState);
}, false);

document.addEventListener('listening', function (event) {
    listeningState = 'listening';
    davisView.setListeningState(listeningState);
    if(!muteButtonPressed) {
        davisView.listening();
        micOn.play();
    }
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

document.addEventListener('chatMode', function (event) {
    listeningState = 'chatMode';
    davisView.setListeningState(listeningState);

    if (!isMuted) {
        toggleMute(true);
    }
    
    enableListenForKeyword(false);
}, false);

/**
 * interactWithRuxit() sends a request to be processed for its intent 
 * in order to interact with the Ruxit API (provides APM metrics)
 * 
 * @param {String} request
 */
function interactWithRuxit(request) {
    
    // Debug mode
    if (request.includes('debug = true') || (debug && request.includes('debug ') && !request.includes('debug = false'))) {
        
        debug = true;
        localStorage.setItem('davis-debug-mode', 'true');
        console.log('Davis: Debug mode enabled');
        
        // Output missed phrases option flag
        if (request.includes(' -m') && localStorage.getItem('davis-missed-phrases')) {
            
            let missedPhrases = JSON.parse(localStorage.getItem('davis-missed-phrases'));
            let html = "<table class='debug'>";
            
            for (let i = 0; i < missedPhrases.phrases.length; i++) {
                
                html += "<tr class='debug'><td class='debug'>" + missedPhrases.phrases[i].phrase + "</td>";
                html += "<td class='debug'>" + missedPhrases.phrases[i].count + "</td></tr>";

            }
            
            html += "</table>";
            davisView.addToInteractionLog(html);
            
        }
        
    } else if (request.includes('debug = false')) {
        
        debug = false;
        localStorage.setItem('davis-debug-mode', 'false');
        console.log('Davis: Debug mode disabled');
        
    } else {

        if (request === '') {
            toggleMute(true);
            inactivityTimeout = 2;
        } else {
            inactivityTimeout = 1;
        }
    
        davisView.muted();
        
        if (listeningState !== 'chatMode') {
            document.dispatchEvent(listeningStateEvents.processing);
        }
    
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
}

/**
 *  outputTextAndSpeech() forwards text to be added to the interaction log and be spoken
 * 
 * @param {String} text
 * @param {String} voice
 * @param {Boolean} listen
**/
function outputTextAndSpeech(text, voice, listen) {
    
    if (listeningState !== 'chatMode') {
        document.dispatchEvent(listeningStateEvents.responding);
    }
    
    listenAfter = listen;

    getTtsToken().then(function (token) {

        if (isSpeaking()) {
            
            outputWhenDoneSpeaking(text, token, voice);
            
        } else {
            
            if (listeningState !== 'chatMode') {
                speak(text, token, voice);
            } else {
                chat(text);
            }
            
        }

    }).then(function () {
        
        if (!isMuted) {
            
            outputQueueSize++;
            unmuteWhenDoneSpeaking();

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
 * getConnectedServerUrl() returns url of server connected to Davis instance 
 * 
 * @return {Promise} connected url
 */
function getConnectedServerUrl() {
    
    var options = {
        method: 'get',
        mode: 'cors'
    };
    
    return fetch('/web/server', options)
    .then(function (response) {
        return response.text();
    });
    
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
            outputElement: '#'+davisView.getTextInputElemId()
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
    
        player.onplay = function () {
            davisView.addToInteractionLog(text, true, true);
        };
        
        WatsonSpeech.TextToSpeech.synthesize({
            text: text,
            token: token,
            voice: voice,
            element: player
        });
    
}

function chat(text) {
    davisView.addToInteractionLog(text, true, false);
}

/**
 * isSpeaking() returns whether TTS audio is being played
 * 
 * @return {Boolean}
 */
function isSpeaking() {
    return !(player.ended || player.paused);
}

/**
 * unmuteWhenDoneSpeaking() enables the mic when done playing TTS audio
 * 
 */
function unmuteWhenDoneSpeaking() {
    
    if (isSpeaking()) {
        
        var timeout = setTimeout(unmuteWhenDoneSpeaking, 60);
        
    } else {
        
        clearTimeout(timeout);
        
        if (momentsOfSilence >= 1) {
            
            momentsOfSilence = 0;
            outputQueueSize--;
            
            if (outputQueueSize < 1 && listeningState !== 'chatMode' && !muteButtonPressed && listenAfter) {
                
              listen();
              
            } else if (!listenAfter) {
                toggleMute(true);
                enableListenForKeyword(true);
            } else {
                muteButtonPressed = false;
            }
            
        } else {
            
            momentsOfSilence++;
            var timeout = setTimeout(unmuteWhenDoneSpeaking, 60);
            
        }
        
    }
    
}

/**
 * outputWhenDoneSpeaking() forwards text and a token for use with IBM Watson TTS API 
 * when all previous TTS audio is done playing
 * 
 * @param {String} text
 * @param {String} token
 */
function outputWhenDoneSpeaking(text, token, voice) {
    
    if (isSpeaking()) {
        
        var timeout = setTimeout(function () { 
            outputWhenDoneSpeaking(text, token, voice); 
        }, 50);
        
    } else {
        
        clearTimeout(timeout);
        
        if (listeningState !== 'chatMode') {
            speak(text, token, voice);
        } else {
            chat(text);
        }
        
    }
    
}

/**
 * listen() interacts with the IBM Watson STT API
 * when there's no interaction in progress already
 */
function listen() {
    
    if (listeningState !== 'listening') {

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
        
        annyang.setLanguage('en');
        
        annyang.addCallback('result', function (phrases) {
            
            let launch = false;
            
            localResponses.phrases.forEach(function (phrase) {
               if (phrases[0].toLowerCase().trim().includes(phrase)) {
                   launch = true;
               } 
            });
            
            if (launch) {
                
                document.dispatchEvent(listeningStateEvents.enablingMic);
                listenAfter = true;
                toggleMute(false);
                
            } else if (debug && phrases[0].toLowerCase().trim().split(' ').length < 5) {
                
                let missedPhrases = {phrases: []};
                let missedPhrase = phrases[0].toLowerCase().trim();
                
                console.log('Davis: Missed phrase logged');
                console.log('"'+ missedPhrase +'"');
                
                // check if JSON is stored in localStorage
                if (localStorage.getItem('davis-missed-phrases')) {
                
                    missedPhrases = JSON.parse(localStorage.getItem('davis-missed-phrases'));
                    
                    // Check if missed phrase is already stored in array [{phrase, count}] within object 
                    // Increment count if already stored, push if not
                    for (var i = 0; i < missedPhrases.phrases.length; i++) {
                       
                        if (missedPhrases.phrases[i].phrase == missedPhrase) {
                            missedPhrases.phrases[i].count++;
                            i = -1; // Mark as found
                            break;
                        }
                        
                    }
                    
                    if (i != -1) {
                        missedPhrases.phrases.push({phrase: missedPhrase, count: 1});
                    }
                    
                } else {
                    missedPhrases.phrases.push({phrase: missedPhrase, count: 1});
                }
                
                localStorage.setItem('davis-missed-phrases', JSON.stringify(missedPhrases));
            }
            
        });

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
 * Unless in chat mode, mic off mode 
 * still listens for key phrases with annyang
 * 
 * @param {Boolean} mute
 */
function toggleMute(mute) {
    
    listenAfter = true;
    
    document.dispatchEvent(listeningStateEvents.sleeping);
    
    if (!isMuted && mute == undefined && !muteButtonPressed) {
        muteButtonPressed = true;
    } else {
        muteButtonPressed = false;
    }
    
    if ((!isMuted && mute != false) || muteButtonPressed) {
        
        isMuted = true;
        davisView.muted();
        
        if (stream != null) {
            stream.stop();
        }
        
        enableListenForKeyword(true);
        
    } else {
        
        isMuted = false;
        davisView.listening();
        enableListenForKeyword(false);
        unmuteWhenDoneSpeaking();
        
    }
    
}

/**
 * noMic() accounts for cases where no mic browser API is detected (error handeling)
 */
function noMic() {
    
    document.dispatchEvent(listeningStateEvents.chatMode);
    outputTextAndSpeech(localResponses.errors.noMic, localResponses.voices.michael, false);
    davisView.noMic();
    davisView.muted();
    
}

/**
 * init() is a global initializer (called via onload) 
 */
function init() {
    
    if (typeof window.chrome != 'object') {
        
        document.dispatchEvent(listeningStateEvents.chatMode);
        davisView.noMic();
        davisView.muted();
        
    } else {
        
        timezone = jstz.determine().name();
        getDavisUserToken();
        getConnectedServerUrl().then(function (url) {
            davisView.setConnectedUrl(url);
        });
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
    enableChatMode: function () {
        document.dispatchEvent(listeningStateEvents.chatMode);
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
    },
    process: function () {
        interactWithRuxit($('#'+davisView.getTextInputElemId()).val());
    }
    
}

})()