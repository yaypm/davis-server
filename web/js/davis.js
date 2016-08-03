var davis = (function() {

// Globals
var sentences = [];                       // Array of response sentences to be typed into interaction log
var isMuted = false;                      // No STT
var muteButtonPressed = false;            // Prevent automatically unmutting if mute button is pressed
var isSilentMode = false;                 // No STT and TTS
var isListening = false;                  // Is Watson STT API listening?
var inactivityTimeout = 1;                // Seconds of silence before Watson STT API stops listening
var momentsOfSilence = 0;                 // Used for polling number of moments of silence 60 ms apart (avoid cutting off TTS playback) 
var player = new Audio();                 // Audio element used to play TTS audio
var micOn = new Audio('./audio/pop.wav'); // Mic on sound effect
var stream;                               // IBM STT stream
var outputQueueSize = 0;                  // Counter for keeping track of queued outputTextAndSpeech() calls
var timezone;                             // User's timezone
var userToken;                            // Random token used in place of a user ID to store/retrieve conversations in web version
var listenAfter = true;                   // Make Watson listen after outputting a response

// Listening states that get displayed above text input
var listeningStates = {
    sleeping: 'Wake me by saying "Hey Davis"',
    listening: 'Listening ...',
    responding: 'Responding ...',
    silentMode: 'Chat Mode'
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

// Get local responses object from JSON file
var localResponses;
$.getJSON('./js/local-responses.json', function (data){localResponses = data;});

/**
 * interactWithRuxit() sends a request to be processed for its intent 
 * in order to interact with the Ruxit API (provides APM metrics)
 * 
 * @param {String} request
 */
function interactWithRuxit(request) {

    if (request === '' && inactivityTimeout === 2) {
        enableSilentMode();
    } else if (request === '') {
        toggleMute(true);
        inactivityTimeout = 2;
    } else {
        inactivityTimeout = 1;
    }

    dimBackground();
    isListening = false;
    updateListeningState(listeningStates.responding);

    $('#textInput').val('');

    if (request) {

        var el = $('<p>' + request + '</p>').css('display', 'none').addClass('userStyle');
        $('#interactionLog').append(el);
        el.fadeIn(400);
    
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
                
                updateListeningState(listeningStates.sleeping);
                return;
                
            }
    
            popTopInteraction();
            
            // check if interaction log is getting long
            if (data.response.length > 70 || $('#interactionLog').children().length > 2) {
                
                if ($('#interactionLog').children().length > 3) {
                    
                    popTopInteraction();
                    popTopInteraction();
                    
                } else {
                    
                    popTopInteraction();
                    
                }
                
            }
    
            if (data.response) {
                
                outputTextAndSpeech(data.response.text, localResponses.voices.michael, !data.response.shouldEndSession);
                
                if (data.response.hyperlink) {
                    window.open(data.response.hyperlink, '_blank').focus();
                }
                
            } else {
                updateListeningState(listeningStates.sleeping);
            }
            
        }).catch(function (err) {
            outputTextAndSpeech(localResponses.errors.server, localResponses.voices.michael, false);
            console.log('interactWithRuxit - Error: ' + err);
        });
    } else {
         updateListeningState(listeningStates.sleeping);
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
            brightenBackground();
            $('#muteSVG').addClass('muteOff');
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

        isListening = true;
        updateListeningState(listeningStates.listening);

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
    
    if (!isSilentMode) {
        
        player.onplay = function () {
            typeText(text);
        };
        
        WatsonSpeech.TextToSpeech.synthesize({
            text: text,
            token: token,
            voice: voice,
            element: player
        });
        
    } else {
        
        var el = $('<p>' + text + '</p>').css('display', 'none').addClass('botStyle');
        $('#interactionLog').append(el);
        el.fadeIn(400);
        
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
 * typeText() forwards text to be added to interactionLog using a type-writer animation
 * 
 * @param {String} text
 */
function typeText(text) {
    
    sentences.push(text);
    var text = sentences[0];
    sentences.splice(0, 1);

    var node = $('<p></p>').addClass('botStyle');

    $('#interactionLog').append(node);

    node.typed({
        strings: [text],
        typeSpeed: 10,
        startDelay: 600,
        showCursor: false
    });
    
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
            
            if (outputQueueSize < 1 && !isSilentMode && !muteButtonPressed && listenAfter) {
                
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
    
    if (!isListening) {

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
 * popTopInteraction() removes the top <p> element from interactionLog
 */
function popTopInteraction() {
    $('#interactionLog').find('p:first').remove();
}

/**
 * submitTextInput() submits text from textInput 
 * as a request in interactWithRuxit() when the Enter key is pressed
 * 
 * Used for chat mode
 * 
 * @param {Integer} keyCode
 */
function submitTextInput(keyCode) {
    
    if (keyCode == 13) {
        
        interactWithRuxit($('#textInput').val());
        $('#textInput').val('');
        $('#textInput').attr('placeholder', '');
        
    }
    
}

/**
 * resetPlaceholder() resets textInput's placeholder
 */
function resetPlaceholder() {
    if (localResponses) {
        $('#textInput').attr('placeholder', localResponses.placeholders.easyTravel);
    }
}

/**
 * brightenBackground() brightens the body's background-color
 */
function brightenBackground() {
    $('body').addClass('micOn');
    $('body').removeClass('micOff');
}

/**
 * dimBackground() dims the body's background-color
 */
function dimBackground() {
    $('body').addClass('micOff');
    $('body').removeClass('micOn');
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
    
    if (!isMuted && mute == null && !muteButtonPressed) {
        muteButtonPressed = true;
    } else {
        muteButtonPressed = false;
    }
    
    if ((!isMuted && mute != false) || muteButtonPressed) {
        
        isMuted = true;
        isListening = false;
        updateListeningState(listeningStates.sleeping);
        $('#muteSVG').removeClass('muteOff');
        dimBackground();
        
        if (stream != null) {
            stream.stop();
        }
        
        enableListenForKeyword(true);
        
    } else {
        
        isMuted = false;
        isSilentMode = false;
        $('#muteSVG').addClass('muteOff');
        enableListenForKeyword(false);
        unmuteWhenDonePlaying();
        
    }
    
}

/**
 * enableSilentMode() enables silent mode
 * 
 * No STT or TTS allowed
 * Enabled automatically when using chat mode
 */
function enableSilentMode() {
    
    isSilentMode = true;
    isListening = false;
    updateListeningState(listeningStates.silentMode);
    
    if (!isMuted) {
        toggleMute(true);
    }
    
    enableListenForKeyword(false);
    
}

/**
 * noMic() accounts for cases where no mic browser API is detected (error handeling)
 */
function noMic() {
    
    isSilentMode = true;
    speak(localResponses.errors.noMic);
    $('#muteWrapper').hide();
    dimBackground();
    
}

/**
 * updateListeningState() sets the current listening state
 * 
 * @param {String} state
 */ 
function updateListeningState(state) {
    $('#listeningState').hide().html(state).fadeIn(800);
}

/**
 * init() is a global initializer (called via onload) 
 */
function init() {
    
    resetPlaceholder();
    
    if (typeof window.chrome != 'object') {
        
        isSilentMode = true;
        $('#muteWrapper').hide();
        dimBackground();
        $.getJSON('./js/local-responses.json', function (data){localResponses = data;});
        speak(localResponses.errors.noBrowserSupport);
        speak(localResponses.errors.chrome);
        speak(localResponses.errors.getChrome);
        
    } else {
        
        timezone = jstz.determine().name();
        annyangInit();
        
        // Delay initial greeting for a smoother experience
        setTimeout(function () {
            if (!localStorage.getItem("davis-user-token")) {
                outputTextAndSpeech(localResponses.greetings.micPermission, localResponses.voices.lisa, false);
                outputTextAndSpeech(localResponses.greetings.thenHelp, localResponses.voices.lisa, false);
            } else {
                outputTextAndSpeech(localResponses.greetings.help, localResponses.voices.lisa, false);
            }
            
            getDavisUserToken();
            toggleMute(true);
        }, 1000);
        
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
        enableSilentMode();
    },
    init: function () {
        init();
    },  
    interactWithRuxit: function (input) {
       interactWithRuxit(input); 
    },
    resetPlaceholder: function () {
        resetPlaceholder();
    },
    submitTextInput: function (keycode) {
        submitTextInput(keycode);
    },
    toggleMute: function () {
        toggleMute();    
    }
    
}

})()