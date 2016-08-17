/**
 * Davis
 * Interact with Dynatrace Platform API via Davis bot
 * Web browser implementation
 * 
 * @author Michael Beemer (Backend)
 * @author Cory Woolf (Frontend)
 * 
 * The MIT License (MIT)
 * Copyright (c) 2016 Dynatrace LLC. All Rights Reserved
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ 
 
 
var davis = (function () { 
    
    var view;
    var controller;
    var localResponses;
    
    /**
     * Initializes Davis library
     * 
     * @param {String} interactionLogElemId
     * @param {String} textInputElemId
     * @param {String} muteWrapperElemId
     * @param {String} muteSVGElemId
     * @param {String} listeningStateElemId
     * @param {String} connectedUrlElemId
     */
    var init = function (interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId) {
        
        $.getJSON('./js/local-responses.json', function (data){
            localResponses = data;
            view = new davisView(interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId);
            controller = new davisController();
            controller.init();
            view.attachEventListeners();
        });
        
    };

    /**
     * View
     * 
     * @param {String} interactionLogElemId
     * @param {String} textInputElemId
     * @param {String} muteWrapperElemId
     * @param {String} muteSVGElemId
     * @param {String} listeningStateElemId
     * @param {String} connectedUrlElemId
     * 
     * @return {Object} global methods
     */
    var davisView = function (interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId) {
        
        this.interactionLogElemId = interactionLogElemId;
        this.textInputElemId = textInputElemId;
        this.muteWrapperElemId = muteWrapperElemId;
        this.muteSVGElemId = muteSVGElemId;
        this.listeningStateElemId = listeningStateElemId;
        this.connectedUrlElemId = connectedUrlElemId;
        
        var sentences = []; // Array of response sentences to be typed into interaction log
       
        resetPlaceholder();
        setListeningState('sleeping');
        if (typeof window.chrome != 'object') {
           
           addToInteractionLog(localResponses.errors.noBrowserSupport, true, false);
           addToInteractionLog(localResponses.errors.chrome, true, false);
           addToInteractionLog(localResponses.errors.getChrome, true, false); 
            
        } else {
        
            if (!localStorage.getItem("davis-user-token")) {
                
                addToInteractionLog(localResponses.greetings.micPermission, true, false);
                setTimeout(function () {
                   addToInteractionLog(localResponses.greetings.thenHelp, true, false);
                }, 5000);
                
            } else {
                addToInteractionLog(localResponses.greetings.help, true, false);
            }
    
        }
        
        /**
         * Initializes event listeners
         */
        function attachEventListeners() {
            
    		$('#'+textInputElemId).keypress(function (event) {
                submitTextInput(event.keyCode);
            });
            
    	    $('#'+textInputElemId).click(function () {
                enableChatMode();
            });
    	    
    	    $('#'+textInputElemId).focus(function () {
                enableChatMode();
            });
            
            $('#'+textInputElemId).blur(function () {
                resetPlaceholder();
            });
            
            $('#'+muteWrapperElemId).click(function () {
                controller.toggleMute();
            });
        }
    
        /**
         * Resets textInput's placeholder
         */
        function resetPlaceholder() {
            $('#'+textInputElemId).attr('placeholder', localResponses.placeholders[Math.floor(Math.random() * localResponses.placeholders.length)]);
        }
        
        /**
         * Resets textInput's value
         */
        function resetTextInput() {
            $('#'+textInputElemId).val('');
        }
        
        /**
         * Updates the listening state text
         * 
         * @param {String} state
         */
        function setListeningState(state) {
            if (localResponses.listeningStates[state] !== $('#'+listeningStateElemId).html()) {
                if (localResponses.listeningStates[state] !== localResponses.listeningStates.enablingMic) {
                    $('#'+listeningStateElemId).hide().html(localResponses.listeningStates[state]).fadeIn(800);
                } else {
                    $('#'+listeningStateElemId).html(localResponses.listeningStates[state]);
                }
            }
        };
        
         /**
         * Displays the logo
         */
        function showLogo() {
            $('#logo').addClass('logoOn');
            $('#logo').removeClass('logoOff');
        }
        
        /**
         * Hides the logo
         */
        function hideLogo() {
            if ($('#logo').hasClass('logoOn')) {
                $('#logo').addClass('logoOff');
                $('#logo').removeClass('logoOn');
            }
        }
        
        /**
         * Brightens the body's background-color
         */
        function brightenBackground() {
            $('body').addClass('micOn');
            $('body').removeClass('micOff');
        }
        
        /**
         * Dims the body's background-color
         */
        function dimBackground() {
            if ($('body').hasClass('micOn')) {
                $('body').addClass('micOff');
                $('body').removeClass('micOn');
            }
        }
        
        /**
         * Enables chat mode (text interaction)
         */
        function enableChatMode() {
            dimBackground();
            controller.enableChatMode();
        }
        
        /**
         * Styles mic icon for on state
         */
        function muteOn() {
            $('#'+muteSVGElemId).removeClass('muteOff');
        }
        
        /**
         * Styles mic icon for off state
         */
        function muteOff() {
            $('#'+muteSVGElemId).addClass('muteOff');
        }
        
        /**
         * Removes the top <p> element from interactionLog
         */
        function popTopInteraction() {
            $('#'+interactionLogElemId).find('p:first').remove();
        }
        
        /**
         * Hides mic button
         */
        function noMic() {
            $('#'+muteWrapperElemId).hide();
        }
        
        /**
         * Adds string to interaction log
         * 
         * @param {String} text
         * @param {Boolean} isDavisSpeaking
         * @param {Boolean} isTypeWriter
         */
        function addToInteractionLog(text, isDavisSpeaking, isTypeWriter) {
            
            if (isTypeWriter) {
                typeText(text);
            } else {
                let styleClass = isDavisSpeaking ? 'botStyle' : 'userStyle';   
                let el = $('<p>' + text + '</p>').css('display', 'none').addClass(styleClass);
                $('#'+interactionLogElemId).append(el);
                el.fadeIn(400);
            }
        
            if ($('#'+interactionLogElemId).children().length > 3) {
                
                popTopInteraction();
                
            }
            
        }
        
        /**
         * Forwards text to be added to interactionLog using a type-writer animation
         * 
         * @param {String} text
         */
        function typeText(text) {
            
            sentences.push(text);
            var text = sentences[0];
            sentences.splice(0, 1);
        
            var node = $('<p></p>').addClass('botStyle');
        
            $('#'+interactionLogElemId).append(node);
        
            node.typed({
                strings: [text],
                typeSpeed: 10,
                startDelay: 600,
                showCursor: false
            });
            
        }
        
        /**
         * Submits text from textInput 
         * as a request in interactWithRuxit() when the Enter key is pressed
         * 
         * Used for chat mode
         * 
         * @param {Integer} keyCode
         */
        function submitTextInput(keyCode) {
            
            if (keyCode == 13) {
                
                controller.interactWithRuxit($('#'+textInputElemId).val());
                resetTextInput();
                $('#'+textInputElemId).attr('placeholder', '');
                
            }
            
        }
          
        // view global methods  
        return {
            
            setListeningState: function (state) {
                setListeningState(state);  
            },
            
            listening: function () {
                brightenBackground();  
                muteOff();
            },
            
            muted: function () {
                dimBackground();
                muteOn();
            },
            
            noMic: function () {
                noMic();
            },
            
            resetPlaceholder: function () {
                resetPlaceholder();
            },
            
            resetTextInput: function () {
                resetTextInput();  
            },
            
            addToInteractionLog: function (text, isDavisSpeaking, typeText) {
                addToInteractionLog(text, isDavisSpeaking, typeText);
            },
            
            submitTextInput: function (keyCode) {
                submitTextInput(keyCode);
            },
            
            getTextInputElemId: function () {
                return textInputElemId;
            },
            
            enableChatMode: function () {
               enableChatMode();
            },
            
            setConnectedUrl: function (url) {
                $('#'+connectedUrlElemId).html('<span style="opacity:0.4;">Connected:</span> <a href="' + url + '" target="_blank">'+url+'</a>');
            },
            
            getLocalResponses: function () {
                return localResponses;
            },
            
            attachEventListeners: function () {
                attachEventListeners();
            },
            
            hideLogo: function () {
                hideLogo();
            },
            
            showLogo: function () {
                showLogo();
            }
            
        };
        
    };


    /**
     * Controller
     * 
     * @return {Object} global methods
     */
    var davisController = function () {
    
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
            view.setListeningState(listeningState);
            view.muted();
        }, false);
        
        document.addEventListener('enablingMic', function (event) {
            listeningState = 'enablingMic';
            view.setListeningState(listeningState);
        }, false);
        
        document.addEventListener('listening', function (event) {
            listeningState = 'listening';
            view.setListeningState(listeningState);
            if(!muteButtonPressed) {
                view.listening();
                micOn.play();
            }
        }, false);
        
        document.addEventListener('processing', function (event) {
            listeningState = 'processing';
            view.setListeningState(listeningState);
            view.resetTextInput();
        }, false);
        
        document.addEventListener('responding', function (event) {
            listeningState = 'responding';
            view.setListeningState(listeningState);
        }, false);
        
        document.addEventListener('chatMode', function (event) {
            listeningState = 'chatMode';
            view.setListeningState(listeningState);
        
            if (!isMuted) {
                toggleMute(true);
            }
            
            enableListenForKeyword(false);
        }, false);
        
        /**
         * Sends a request to be processed for its intent 
         * in order to interact with the Ruxit API (provides APM metrics)
         * 
         * @param {String} request
         */
        function interactWithRuxit(request) {
            
            view.hideLogo();
            
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
                    view.addToInteractionLog(html);
                    
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
            
                view.muted();
                
                if (listeningState !== 'chatMode') {
                    document.dispatchEvent(listeningStateEvents.processing);
                }
            
                if (request) {
            
                    view.addToInteractionLog(request, false, false);
                
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
                            
                            outputTextAndSpeech(view.getLocalResponses().errors.nullResponse, view.getLocalResponses().voices.michael, false);
                            return;
                            
                        } else if (!data.response) {
                            
                            document.dispatchEvent(listeningStateEvents.sleeping);
                            return;
                            
                        }
                
                        if (data.response) {
                            
                            outputTextAndSpeech(data.response.text, view.getLocalResponses().voices.michael, !data.response.shouldEndSession);
                            
                            // "Show me" hyperlink push functionality
                            if (data.response.hyperlink) {
                                window.open(data.response.hyperlink, '_blank');
                            }
                            
                        } else {
                            document.dispatchEvent(listeningStateEvents.sleeping);
                        }
                        
                    }).catch(function (err) {
                        document.dispatchEvent(listeningStateEvents.chatMode);
                        outputTextAndSpeech(view.getLocalResponses().errors.server, view.getLocalResponses().voices.michael, false);
                        console.log('interactWithRuxit - Error: ' + err);
                    });
                } else {
                     document.dispatchEvent(listeningStateEvents.sleeping);
                }
            }
        }
        
        /**
         *  Forwards text to be added to the interaction log and be spoken
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
         * Returns a token with no expiration
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
         * Returns url of server connected to Davis instance 
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
         * Returns a token for use with IBM Watson TTS
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
         * Returns a token for use with IBM Watson TTS
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
         * Helps setup an audio capture stream for IBM Watson STT API
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
                    outputElement: '#'+view.getTextInputElemId()
                });
        
                stream.on('error', function (err) {
                    console.log(err);
                });
                
                document.dispatchEvent(listeningStateEvents.listening);
        
            });
            
        }
        
        /**
         * Forwards text and a token for use with IBM Watson TTS API
         * 
         * @param {String} text
         * @param {String} token
         * @param {String} voice
         */
        function speak(text, token, voice) {
            
                player.onplay = function () {
                    view.addToInteractionLog(text, true, true);
                };
                
                WatsonSpeech.TextToSpeech.synthesize({
                    text: text,
                    token: token,
                    voice: voice,
                    element: player
                });
            
        }
        
        /**
         * Add to interaction log in chat mode
         */
        function chat(text) {
            view.addToInteractionLog(text, true, false);
        }
        
        /**
         * Returns whether TTS audio is being played
         * 
         * @return {Boolean}
         */
        function isSpeaking() {
            return !(player.ended || player.paused);
        }
        
        /**
         *Enables the mic when done playing TTS audio
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
         * Forwards text and a token for use with IBM Watson TTS API 
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
         * Interacts with the IBM Watson STT API
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
         * Initializes the annyang STT library for use as a key phrase listener 
         *
         * Note: Requires SpeechRecognition browser API
         */
        function annyangInit() {
            
            if (annyang) {
                
                annyang.setLanguage('en');
                
                annyang.addCallback('result', function (phrases) {
                    
                    let launch = false;
                    
                    view.getLocalResponses().phrases.forEach(function (phrase) {
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
         * Enables or disables the annyang STT library (used for listening for key phrases)
         * 
         * Note: Used when toggling between the annyang STT library and IBM Watson STT API
         */
        function enableListenForKeyword(listen) {
            listen ? annyang.start({ 'autoRestart': true, 'continuous': true }) : annyang.abort();
        }
        
        /**
         * Toggles the mic on/off
         * 
         * Note: Unless in chat mode, mic off mode still listens for key phrases with annyang
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
                view.muted();
                
                if (stream != null) {
                    stream.stop();
                }
                
                enableListenForKeyword(true);
                
            } else {
                
                isMuted = false;
                view.listening();
                enableListenForKeyword(false);
                unmuteWhenDoneSpeaking();
                
            }
            
        }
        
        /**
         * Accounts for cases where no mic browser API is detected (error handeling)
         */
        function noMic() {
            
            document.dispatchEvent(listeningStateEvents.chatMode);
            outputTextAndSpeech(view.getLocalResponses().errors.noMic, view.getLocalResponses().voices.michael, false);
            view.noMic();
            view.muted();
            
        }
        
        /**
         * Controller's initializer (called via onload) 
         */
        function init() {
            
            if (typeof window.chrome != 'object') {
                
                document.dispatchEvent(listeningStateEvents.chatMode);
                view.noMic();
                view.muted();
                
            } else {
                
                timezone = jstz.determine().name();
                getDavisUserToken();
                getConnectedServerUrl().then(function (url) {
                    view.setConnectedUrl(url);
                });
                annyangInit();
                enableListenForKeyword(true);
                document.dispatchEvent(listeningStateEvents.sleeping);
                view.showLogo();
                
            }
            
        }
        
        // controller global methods
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
                interactWithRuxit($('#'+view.getTextInputElemId()).val());
            }
            
        };
    
    };
    
    // davis global methods
    return {
        
        init: init,
        
        getView: function () {
            return view;
        },
        
        getController: function () {
            return controller;
        }
        
    };
    
})()