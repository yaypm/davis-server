// globals
var sentences = [];                       // Array of response sentences to be typed into interaction log
var isMuted = false;                      // no STT
var isSilentMode = false;                 // no STT and TTS
var isListening = false;                  // Is Watson STT API listening?
var inactivityTimeout = 1;                // Seconds of silence before Watson STT API stops listening
var momentsOfSilence = 0;                 // Used for polling number of moments of silence 60 ms apart (avoid cutting off TTS playback) 
var player = new Audio();                 // Audio element used to play TTS audio
var micOn = new Audio('./audio/pop.wav'); // Mic on sound effect
var stream;                               // IBM STT stream
var talkWaitCount = 0;                    // counter for keeping track of queued talk() calls
var slackEndPoints = {
    'aws': 'https://umqjven962.execute-api.us-east-1.amazonaws.com/dev/slack',
    'dev': 'https://davis-backend-corywoolf.c9users.io/slack'
};
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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
 * Send requests to be processed with the Ruxit API, receive responses with metrics
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

    $('#body').addClass('micOff');
    $('#body').removeClass('micOn');
    isListening = false;

    $('#textInput').val('');

    var el = $('<p>' + request + '</p>').css('display', 'none').addClass('userStyle');
    $('#interactionLog').append(el);
    el.fadeIn(400);

    var date = new Date();

    var input = {
        sessionId: 'websession-' + date.getDate() + date.getMonth() + date.getFullYear(),
        request: request
    };

    var options = {
        method: 'post',
        mode: 'cors',
        body: JSON.stringify(input),
        headers: new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        })
    };

    fetch(slackEndPoints.aws, options)
    .then(function (response) {
        return response.json();
    }).then(function (data) {
        if (!data.response && request.length > 0) {
            talk('Sorry about that, I\'m not sure what you meant, please try again.');
            return;
        } else if (!data.response) {
            return;
        }

        popTopInteraction();
      // check if response is long
        if (data.response.length > 70 || $('#interactionLog').children().length > 2) {
            popTopInteraction();
        }

        if (data.response != null) {
            talk(data.response);
        }
    }).catch(function (err) {
        talk('There\'s an issue with the Davis server right now, please try again later.');
        console.log('interactWithRuxit - Error: ' + err);
    });
}


/**
 *   add text to output and speak out
**/
function talk(text) {

    getTtsToken().then(function (token) {

        if (isPlaying()) {
            playWhenDonePlaying(text, token);
        } else {
            speak(text, token);
        }

    }).then(function () {
        if (!isMuted) {
            talkWaitCount++;
            unmuteWhenDonePlaying();
        }
    });
}

/**
 * Tokens have a time to live (TTL) of one hour, so we will refresh the token every 59 minutes to be safe
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

        // save new token
          savedTtsTokenObj.expiration = new Date();
          savedTtsTokenObj.token = response.text();

          return savedTtsTokenObj.token;
      });
    }
}

/**
 * Tokens have a time to live (TTL) of one hour, so we will refresh the token every 59 minutes to be safe
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

          // save new token
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

        $('#body').addClass('micOn');
        $('#body').removeClass('micOff');
        $('#muteSVG').addClass('muteOff');
        micOn.play();

    });
}

/**
 * Setup audio capture stream using IBM Watson STT API
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

    });
}

/**
 * Speak text using IBM Watson TTS API
 */
function speak(text, token) {
    if (!isSilentMode) {
        WatsonSpeech.TextToSpeech.synthesize({
            text: text,
            token: token,
            voice: 'en-US_MichaelVoice',
            element: player
        });
        setTimeout(function () {
            typeText(text);
        }, 500);
    } else {
        var el = $('<p>' + text + '</p>').css('display', 'none').addClass('botStyle');
        $('#interactionLog').append(el);
        el.fadeIn(400);
    }
}

/**
 * Is TTS audio being spoken/played?
 */
function isPlaying() {
    return !(player.ended || player.paused);
}

/**
 * Type writer animation
 */
function typeText(text) {
    sentences.push(text);
    var text = sentences[0];
    sentences.splice(0, 1);

    var node = $('<p></p>').addClass('botStyle');

    $('#interactionLog').append(node);

    node.typed({
        strings: [text],
        typeSpeed: 20,
        startDelay: 0,
        showCursor: false
    });
}

/**
 * Enable mic when done speaking/playing
 */
function unmuteWhenDonePlaying() {
    if (isPlaying()) {
        var timeout = setTimeout(unmuteWhenDonePlaying, 60);
    } else {
        clearTimeout(timeout);
        if (momentsOfSilence >= 1) {
            momentsOfSilence = 0;
            talkWaitCount--;
            if (talkWaitCount < 1 && !isSilentMode) {
              listen();
          }
        } else {
            momentsOfSilence++;
            var timeout = setTimeout(unmuteWhenDonePlaying, 60);
        }
    }
}

/**
 * Speak/play more text when TTS in progress or waiting finishes
 */
function playWhenDonePlaying(text, token) {
    if (isPlaying()) {
        var timeout = setTimeout(function () { playWhenDonePlaying(text, token); }, 50);
    } else {
        clearTimeout(timeout);
        speak(text, token);
    }
}

/**
 * Listen to user using STT
 */
function listen() {
    if (!isListening) {

        getSttToken()
      .then(function (token) {
          createSttStream(token);
      })
      .catch(function (err) { console.log(err); });
    }
}

/**
 * Initialize annyang STT library for use as key phrase listener 
 * Not compatible with Safari, requires SpeechRecognition standard support
 */
function annyangInit() {
    if (!isSafari && annyang) {

        annyang.addCallback('result', function (phrases) {
            if (phrases[0].toLowerCase().includes('hey davis') || phrases[0].toLowerCase().includes('ok davis')) {
              toggleMute(false);
          }
        });

        annyang.setLanguage('en');

    }
}

/**
 * Enable or disable annyang STT library for listening for key phrases
 * Used when toggling between the annyang STT library and IBM Watson STT API
 */
function enableListenForKeyword(listen) {
    if (!isSafari) {
        listen ? annyang.start({ 'autoRestart': true, 'continuous': true }) : annyang.abort();
    }
}

/**
 * Remove top <p> element from interactionLog
 */
function popTopInteraction() {
    $('#interactionLog').find('p:first').remove();
}

/**
 * Submit text in textbox as a request
 * Used for chat mode
 */
function submitTextInput(keyCode) {
    if (keyCode == 13) {
        var textInput = $('#textInput');
        interactWithRuxit($('#textInput').val());
        $('#textInput').val('');
        $('#textInput').attr('placeholder', '');
    }
}

/**
 * Reset textbox placeholder
 */
function resetPlaceholder() {
    $('#textInput').attr('placeholder', 'How\'s easyTravel doing?');
}

/**
 * Toggle mic on/off
 * Unless in silent mode, mic off mode still listens for key phrases
 */
function toggleMute(mute) {
    if (!isMuted && mute != false) {
        isMuted = true;
        isListening = false;
        $('#muteSVG').removeClass('muteOff');
        $('#body').addClass('micOff');
        $('#body').removeClass('micOn');
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
 * Enable silent mode
 * No STT or TTS allowed
 * Enabled automatically when using chat mode
 */
function enableSilentMode() {
    isSilentMode = true;
    isListening = true;
    if (!isMuted) {
        toggleMute(true);
    }
    enableListenForKeyword(false);
}

/**
 * No mic error handeling
 */
function noMic() {
    talk('Unfortunately, there appears to be no microphone enabled on your device. '
    + 'That\'s okay, as an alternative, feel free to use the textbox below to chat with me.');
    isSilentMode = true;
    $('#muteWrapper').hide();
    $('#body').addClass('micOff');
    $('#body').removeClass('micOn');
}

/**
 * Global initializer that gets called onLoad 
 */
function init() {
    resetPlaceholder();
    annyangInit();
    setTimeout(function () {
        talk('Hi, my name\'s Davis, your virtual Dev-Ops assistant.');
        talk('What can I help you with today?');
    }, 2 * 1000);
}