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
    var init = function (interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId, gitElemId) {
        
        $.getJSON('./js/local-responses.json', function (data){
            localResponses = data;
            $(document).ready(function() {
                view = new davisView(interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId, gitElemId);
                controller = new davisController(); 
                view.init();
                controller.init();
                view.attachEventListeners();
            });
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
    var davisView = function (interactionLogElemId, textInputElemId, muteWrapperElemId, muteSVGElemId, listeningStateElemId, connectedUrlElemId, gitElemId) {
        
        this.interactionLogElemId = interactionLogElemId;
        this.textInputElemId = textInputElemId;
        this.muteWrapperElemId = muteWrapperElemId;
        this.muteSVGElemId = muteSVGElemId;
        this.listeningStateElemId = listeningStateElemId;
        this.connectedUrlElemId = connectedUrlElemId;
        this.gitElemId = gitElemId;
        
        var sentences = []; // Array of response sentences to be typed into interaction log
        var textBeingTyped;
        var elementBeingTyped;
        var cards = localStorage.getItem('davis-cards-enabled') || 'true';
        
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
                $('#'+listeningStateElemId).html(localResponses.listeningStates[state]);
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
            $('#interactionLogGradientTop').hide();
            $('#interactionLogGradientBottom').hide();
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
                $('#interactionLogGradientTop').fadeIn(3000);
                $('#interactionLogGradientBottom').fadeIn(3000);
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
         * Removes the top element from interactionLog
         */
        function popTopInteraction() {
            $('#'+interactionLogElemId).find('>:first').remove();
        }
        
        /**
         * Hides mic button
         */
        function noMic() {
            $('#'+muteWrapperElemId).css('visibility', 'hidden');
        }
        
        /**
         * Adds string to interaction log
         * 
         * @param {Object} response
         * @param {Boolean} isDavisSpeaking
         * @param {Boolean} isTypeWriter
         */
        function addToInteractionLog(response, isDavisSpeaking, isTypeWriter) {
            
            if (response.card && cards === 'true') {
                
                addCard(response.card);
                 
            } else if (isTypeWriter) {
                
                typeText(response.text);
                
            } else {
                
                let styleClass = isDavisSpeaking ? 'botStyle' : 'userStyle';
                let el = $('<p>' + response.text.trim() + '</p>').css('display', 'none').addClass(styleClass);
                $('#'+interactionLogElemId).append(el);
                el.fadeIn(400);
                
            }
            
            $('#'+interactionLogElemId).scrollTop($('#'+interactionLogElemId).prop('scrollHeight'));
            
        }
        
        /**
         * Constructs and adds card to interactionLog
         * 
         * @param {Object} card
         */
        function addCard(card) {
            
            // Add text
            if (card.text !== undefined) {
                addToInteractionLog({text: reformatLinks(card.text, false)}, true, false);
            }
            
            // Add attachments
            if (card.attachments !== undefined && card.attachments.length > 0) {
                
                let html = localResponses.card.wrapper;
                
                let attachments = '';
                
                card.attachments.forEach( (atm, index) => {
                    
                    let attachment = '';
                    
                    // Title
                    if (atm.title !== undefined) {
                        
                       atm.title = atm.title.replace(/\:key\:/g, '🔑');
                        
                        if (atm.title_link !== undefined) {
                            
                            let title = localResponses.card.linkAttachment.replace('{{url}}', atm.title_link);
                            title = title.replace('{{text}}', atm.title);
                            attachment += localResponses.card.title.replace('{{title}}', title);
                            
                        } else {
                            attachment += localResponses.card.title.replace('{{title}}', atm.title);
                        }
                        
                    }
                    
                    // Text
                    if (atm.text !== undefined) {
                        attachment += localResponses.card.text.replace('{{text}}', atm.text);
                    }
                    
                    // Fields
                    if (atm.fields !== undefined) {
                        
                        let fields = '';
                        
                        atm.fields.forEach( (fd) => {
                           
                            let field = localResponses.card.field.replace('{{title}}', fd.title);
                            fields += field.replace('{{value}}', fd.value);

                        });
                        
                        attachment += localResponses.card.fields.replace('{{fields}}', fields);
                    }
                    
                    // Add attachment elements into wrapper
                    if (attachment.length > 0) {
                        
                        attachment = localResponses.card.attachment.replace('{{attachment}}', attachment);
                        
                        // Bar color
                        if (atm.color === undefined) {
                            atm.color = '';
                        }
                        attachment = attachment.replace('{{color}}', atm.color);
                        
                    }
                    
                    // Pretext
                    if (atm.pretext !== undefined && attachment.length == 0 && index == card.attachments.length - 1) {
                        
                        html = html.replace('{{attachments}}', attachments);
                        $('#'+interactionLogElemId).append(html);
                        $('.card-wrapper').fadeIn(400);
                        addToInteractionLog({text: atm.pretext}, true, false);
                        
                    } else if (atm.pretext !== undefined) {
                        
                        attachments += localResponses.card.pretext.replace('{{pretext}}', atm.pretext);
                        attachments += attachment;
                        
                        
                    } else {
                        attachments += attachment;
                    }
                    
                    if (attachment.length > 0 && index == card.attachments.length - 1) {
                        $('#'+interactionLogElemId).append(html);
                        $('.card-wrapper').fadeIn(400); 
                        addToInteractionLog({text: atm.pretext}, true, false);
                    }    
                    
                }); 
                
            }
    
        }
        
        /**
         * Reformats links from Slack syntax to html
         * 
         * @param {String} str
         * @param {Boolean} isAttachment
         */
         function reformatLinks(str, isAttachment) {
             
            if (str.includes('<http')) {
                
                let exploded = str.split('<http');

                exploded.forEach( (fragment, index) => {
                    if (fragment.includes('|') && fragment.includes('>')) {
                        let link = (isAttachment) ? localResponses.card.linkAttachment : localResponses.card.linkText;
                        let url = fragment.substring(0, fragment.indexOf('>'));
                        let text = url.substring(url.indexOf('|') + 1);
                        url = 'http' + url.substring(0, url.indexOf('|'));
                        link = link.replace('{{text}}', text);
                        link = link.replace('{{url}}', url);
                        exploded[index] = fragment.replace(fragment.substring(0, fragment.indexOf('>') + 1), link);
                    }
                });
                
                str = exploded.join('');
            }
            
            return str;
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
        
            textBeingTyped = text;
            elementBeingTyped = $('<p></p>').addClass('botStyle');
        
            $('#'+interactionLogElemId).append(elementBeingTyped);
        
            elementBeingTyped.typed({
                strings: [text],
                typeSpeed: 10,
                startDelay: 600,
                showCursor: false
            });
            
        }
        
        /**
         * Stops typing animation and displays text being typed
         */
        function stopTypewriter() {
            
            // Stop typing
            elementBeingTyped.data('typed').stop();
            
            // Display text
            $(elementBeingTyped).css('display', 'none');
            $(elementBeingTyped).html(textBeingTyped);
            $(elementBeingTyped).fadeIn(400);
            
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
        
        /**
         * Enable offline mode
         * 
         * @param {Boolean} isEnabled
         */
        function enableOfflineMode(isEnabled) {
            
            $("#"+textInputElemId).prop('disabled', isEnabled);
            (isEnabled) ? $("#"+muteWrapperElemId).hide() : $("#"+muteWrapperElemId).show();
            (isEnabled) ? $("#"+connectedUrlElemId).hide() : $("#"+connectedUrlElemId).show();

        }
        
        /**
         * View's initializer (called via onload) 
         */
        function init() {
            resetPlaceholder();
            setListeningState('sleeping');
            
            // Listen for keypress
            // if space-bar and textbox not focused, toggleMute
            $(function() {
                $(window).keypress(function(e) {
                    var key = e.which;
                    if (key == 32 && !$("#"+textInputElemId).is(":focus")) {
                        controller.toggleMute($('#'+listeningStateElemId).html() === localResponses.listeningStates.listening);
                    } else if (key != 32 && !$("#"+textInputElemId).is(":focus")) {
                        $("#"+textInputElemId).focus();
                    }
                });   
            });
            
            if (typeof window.chrome != 'object') {
               
               addToInteractionLog({text: localResponses.errors.noBrowserSupport.text}, true, false);
               addToInteractionLog({text: localResponses.errors.chrome.text}, true, false);
               addToInteractionLog({text: localResponses.errors.getChrome.text}, true, false); 
                
            } else {
            
                if (!localStorage.getItem("davis-user-token")) {
                    
                    addToInteractionLog({text: localResponses.greetings.micPermission.text}, true, false);
                    setTimeout(function () {
                       addToInteractionLog({text: localResponses.greetings.thenHelp.text}, true, false);
                    }, 5000);
                    
                } else {
                    addToInteractionLog({text: localResponses.greetings.help.text}, true, false);
                }
        
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
            
            addToInteractionLog: function (response, isDavisSpeaking, typeText) {
                addToInteractionLog(response, isDavisSpeaking, typeText);
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
                $('#'+connectedUrlElemId).html('<span style="opacity:0.4;">Connected:</span> <a href="' + url + '" target="_blank" class="links">'+url+'</a>');
            },
            
            setGit: function (git) {
                
                let branch = '';
                let updated = '';
                if (git.branch !== 'master') {
                    branch = ' (' + git.branch + ')';
                    updated = ' <br /><span>' + git.lastUpdate + '</span>';
                }
                
                if (git.branch) {
                    $('#'+gitElemId).html('<a href="https://github.com/ruxit/davis-server/releases/tag/' + git.tag + '" target="_blank" class="links">' + git.tag + branch + updated + '</a>');
                }
                
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
            },
            
            getTextBeingTyped: function () {
                return textBeingTyped;  
            },
            
            stopTypewriter: function () {
                stopTypewriter();
            },
            
            enableOfflineMode: function (isEnabled) {
                enableOfflineMode(isEnabled);
            },
            
            enableCards: function (isEnabled) {
                cards = isEnabled.toString();
                (isEnabled) ? addToInteractionLog({text: 'Cards are now enabled'}, true, false) : addToInteractionLog({text: 'Cards have been disabled'}, true, false);
            },
            
            init: function () {
                init();
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
        var inactivityTimeout = 1;                // Seconds of silence before Watson STT API stops listening
        var momentsOfSilence = 0;                 // Used for polling number of moments of silence 60 ms apart (avoid cutting off TTS playback) 
        var player = new Audio();                 // Audio element used to play TTS audio
        var micOn = new Audio('./audio/pop.wav'); // Mic on sound effect
        var stream;                               // IBM STT stream
        var outputQueue = [];                  // Counter for keeping track of queued outputTextAndSpeech() calls
        var timezone;                             // User's timezone
        var userToken;                            // Random token used in place of a user ID to store/retrieve conversations in web version
        var debug = false;                        // Debug mode
        var isSpeaking = false;
        var currentTtsToken;
        
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
            chatMode: new Event('chatMode'),
            offlineMode: new Event('offlineMode')
        }
        
        var evt = new Event('change-stance', {bubbles: false});
        
        document.addEventListener('sleeping', function (event) {
            listeningState = 'sleeping';
            view.setListeningState(listeningState);
            view.muted();
            
            if (evt.targetStance != 'dynatrace') {
                evt.targetStance = 'dynatrace';
                document.getElementById('davisContainer').dispatchEvent(evt);
            }
        }, false);
        
        document.addEventListener('enablingMic', function (event) {
            listeningState = 'enablingMic';
            view.setListeningState(listeningState);
        }, false);
        
        document.addEventListener('listening', function (event) {
            listeningState = 'listening';
            view.setListeningState(listeningState);
            view.listening();
            micOn.play();
            evt.targetStance = 'listening';
            document.getElementById('davisContainer').dispatchEvent(evt);
        }, false);
        
        document.addEventListener('processing', function (event) {
            listeningState = 'processing';
            view.setListeningState(listeningState);
            view.resetTextInput();
            evt.targetStance = 'thinking';
            document.getElementById('davisContainer').dispatchEvent(evt);
        }, false);
        
        document.addEventListener('responding', function (event) {
            listeningState = 'responding';
            view.setListeningState(listeningState);
            evt.targetStance = 'answer';
            document.getElementById('davisContainer').dispatchEvent(evt);
        }, false);
        
        document.addEventListener('chatMode', function (event) {
            listeningState = 'chatMode';
            view.setListeningState(listeningState);
            
            if (evt.targetStance != 'dynatrace') {
                evt.targetStance = 'dynatrace';
                document.getElementById('davisContainer').dispatchEvent(evt);
            }
        
            // Stop typewriter and any audio that's playing
            player.pause();
            player.currentTime = 0;
            
            if (!isMuted && isSpeaking) {
                view.stopTypewriter();
            }
            
            isMuted = true;
            view.muted();
            
            enableListenForKeyword(false);
            
        }, false);
        
        document.addEventListener('offlineMode', function (event) {
            listeningState = 'offlineMode';
            view.setListeningState(listeningState);
        }, false);
        
        // Listen for if offline
        var offlineCheck = function(){
            
            if (Offline.state === 'up') {
                
                Offline.check();
                
                if (listeningState == 'offlineMode') {
                    view.enableOfflineMode(false);
                    document.dispatchEvent(listeningStateEvents.sleeping);
                    listen();
                }
                
            } else {
                
                if (listeningState != 'offlineMode') {
                    document.dispatchEvent(listeningStateEvents.offlineMode);
                }
                
                view.enableOfflineMode(true)
                
            }
            
        }
        setInterval(offlineCheck, 5000);
        
        /**
         * Sends a request to be processed for its intent 
         * in order to interact with the Ruxit API (provides APM metrics)
         * 
         * @param {String} request
         */
        function interactWithRuxit(request) {
            
            view.hideLogo();
            
            // Debug mode
            if ((request.includes('debug') && request.includes('true')) || (request.includes('debug') && !request.includes('false'))) {
                
                debug = true;
                localStorage.setItem('davis-debug-mode', 'true');
                view.addToInteractionLog({text: 'Debug mode enabled'}, true, false);
                
                // Output missed phrases option flag
                if (request.includes(' -m') && localStorage.getItem('davis-missed-phrases')) {
                    
                    let missedPhrases = JSON.parse(localStorage.getItem('davis-missed-phrases'));
                    let html = "<table class='debug'>";
                    
                    for (let i = 0; i < missedPhrases.phrases.length; i++) {
                        
                        html += "<tr class='debug'><td class='debug'>" + missedPhrases.phrases[i].phrase + "</td>";
                        html += "<td class='debug'>" + missedPhrases.phrases[i].count + "</td></tr>";
        
                    }
                    
                    html += "</table>";
                    view.addToInteractionLog({text: html}, true, false);
                    
                }
                
                // Toggle enable cards
                if (request.includes(' -c') && localStorage.getItem('davis-cards-enabled') === 'true') {
                    localStorage.setItem('davis-cards-enabled', 'false');
                    view.enableCards(false);
                } else if (request.includes(' -c')) {
                    localStorage.setItem('davis-cards-enabled', 'true');
                    view.enableCards(true);
                }
                
            } else if (request.includes('debug') && request.includes('false')) {
                
                debug = false;
                localStorage.setItem('davis-debug-mode', 'false');
                view.addToInteractionLog({text: 'Debug mode disabled'}, true, false);
                
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
            
                    view.addToInteractionLog({text: request}, false, false);
                
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
                            
                            document.dispatchEvent(listeningStateEvents.chatMode);
                            outputTextAndSpeech(view.getLocalResponses().errors.nullResponse, view.getLocalResponses().voices.michael, false);
                            return;
                            
                        } else if (!data.response) {
                            
                            document.dispatchEvent(listeningStateEvents.sleeping);
                            return;
                            
                        }
                
                        if (data.response) {

                            outputTextAndSpeech(data.response, view.getLocalResponses().voices.michael, !data.response.shouldEndSession);
                            
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
                    if (listeningState !== 'chatMode') {
                        document.dispatchEvent(listeningStateEvents.sleeping);
                    }
                }
            }
        }
        
        /**
         *  Forwards text to be added to the interaction log and be spoken
         * 
         * @param {Object} response
         * @param {String} voice
         * @param {Boolean} listen
         **/
        function outputTextAndSpeech(response, voice, listen) {
        
            if (listeningState !== 'chatMode') {
                
                if (!isSpeaking) {
                    document.dispatchEvent(listeningStateEvents.responding);
                    speak(response, voice, listen);
                } else {
                    outputQueue.push({response: response, voice: voice, listen: listen});
                }
        
            } else {
                chat(response);
            }
                    
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
         * Returns Git info
         * 
         * @return {Promise} info
         */
        function getGit() {
            
            var options = {
                method: 'get',
                mode: 'cors'
            };
            
            return fetch('/api/v1/git', options)
            .then(function (response) {
                return response.json();
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
                    noMic();
                });
        
            });
            
        }
        
        /**
         * Listens to user request or plays response
         * 
         * @param {Boolean} listen - listen to user after playing
         */
        function listenOrSpeak(listen) {
            isSpeaking = false;
            if (listen && outputQueue.length == 0) {
                unmute();
            } else if (outputQueue.length > 0) {
                let output = outputQueue.shift();
                speak(output.text, output.voice, output.listen);
            } else {
                document.dispatchEvent(listeningStateEvents.sleeping);
                enableListenForKeyword(true);
            }
        }
        
        /**
         * Forwards text and a token for use with IBM Watson TTS API
         * 
         * @param {Object} response - text to be spoken and/or displayed
         * @param {String} voice - select voice for TTS
         * @param {Boolean} listen - listen after TTS plays
         */
        function speak(response, voice, listen) {
            
                let watsonText = (response.ssml) ? response.ssml : response.text;
            
                player.onplay = function () {
                    isSpeaking = true;
                    view.addToInteractionLog(response, true, true);
                };
                
                player.onpause = function () {
                    listenOrSpeak(listen);
                };
                
                player.onended = function () {
                    listenOrSpeak(listen);
                };
                
                getTtsToken().then( token => {
                    WatsonSpeech.TextToSpeech.synthesize({
                        text: watsonText,
                        token: token,
                        voice: voice,
                        element: player
                    });
                }).catch(err => {
                   console.log(err);
                   noMic();
                });
               
            
        }
        
        /**
         * Add to interaction log in chat mode
         * 
         * @param {Object} response
         */
        function chat(response) {
            view.addToInteractionLog(response, true, false);
        }
        
        /**
         *Enables the mic when done playing TTS audio
         */
        function unmute() {
            
            if (outputQueue.length < 1 && listeningState !== 'chatMode') {
                
                listen();
              
            } else if (listeningState !== 'chatMode') {
                toggleMute(true);
                enableListenForKeyword(true);
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
                    document.dispatchEvent(listeningStateEvents.listening);
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
                
                enableListenForKeyword(true);
        
            }
            
        }
        
        /**
         * Enables or disables the annyang STT library (used for listening for key phrases)
         * 
         * Note: Used when toggling between the annyang STT library and IBM Watson STT API
         */
        function enableListenForKeyword(listen) {
            listen ? annyang.start({ 'autoRestart': true, 'continuous': false }) : annyang.abort();
        }
        
        /**
         * Toggles the mic on/off
         * 
         * Note: Unless in chat mode, mic off mode still listens for key phrases with annyang
         * 
         * @param {Boolean} mute
         */
        function toggleMute(mute) {
            
            if (listeningState !== 'chatMode') {
                document.dispatchEvent(listeningStateEvents.sleeping);
            }
            
            if (isSpeaking) {
                
                // Stop typewriter and any audio that's playing
                player.pause();
                player.currentTime = 0;
                view.stopTypewriter();
                isMuted = false;
                enableListenForKeyword(false);
                document.dispatchEvent(listeningStateEvents.enablingMic);
                unmute();
                
            } else {
            
                if (!isMuted && mute) {
                    
                    isMuted = true;
                    view.muted();
                    
                    if (stream != null) {
                       stream.stop();
                    }
                    
                    enableListenForKeyword(true);
                    
                } else if (!mute) {
                   
                    isMuted = false;
                    enableListenForKeyword(false);
                    document.dispatchEvent(listeningStateEvents.enablingMic);
                    unmute();
                    
                }
            
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
                
                getConnectedServerUrl().then( url => {
                    view.setConnectedUrl(url);
                });
                
                getGit().then( git => {
                   view.setGit(git);
                });
        
                // Get tokens and confirm using SSL
                // if failure fallback to chat mode
                getSttToken()
                .then( token => {
                    return getTtsToken();
                }).then( token => {
                    
                    if (location.protocol === 'https:' || location.href.includes('127.0.0.1') || location.href.includes('localhost')) {

                        annyangInit();
                        document.dispatchEvent(listeningStateEvents.sleeping);
                        evt.targetStance = 'dynatrace';
                        document.getElementById('davisContainer').dispatchEvent(evt);
                        
                    } else {
                        noMic();
                    }
                    
                })
                .catch( err => {
                    console.log(err);
                    noMic();
                });
                
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
            toggleMute: function (mute) {
                toggleMute(mute);    
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