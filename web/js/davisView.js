var localResponses;

var davisView = (function () {
    
    // Globals
    var listeningStateElemId = 'listeningState';
    var interactionLogElemId = 'interactionLog';
    var muteWrapperElemId = 'muteWrapper';
    var muteSVGElemId = 'muteSVG';
    var textInputElemId = 'textInput';
    var sentences = [];                                         // Array of response sentences to be typed into interaction log

    $.getJSON('./js/local-responses.json', function (data){
        localResponses = data;
        resetPlaceholder();
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
    });
    
    window.onload = function () {
        davisController.init();
        attachEventListeners();
    };
    
    /**
     * attachEventListeners() initializes event listeners
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
            davisController.toggleMute();
        });
    }

    /**
     * resetPlaceholder() resets textInput's placeholder
     */
    function resetPlaceholder() {
        $('#'+textInputElemId).attr('placeholder', localResponses.placeholders.easyTravel);
    }
    
    /**
     * resetTextInput() resets textInput's value
     */
    function resetTextInput() {
        $('#'+textInputElemId).val('');
    }
    
    /**
     * setListeningState() updates the listening state text
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
        if ($('body').hasClass('micOn')) {
            $('body').addClass('micOff');
            $('body').removeClass('micOn');
        }
    }
    
    function enableChatMode() {
        dimBackground();
        davisController.enableChatMode();
    }
    
    function muteOn() {
        $('#'+muteSVGElemId).removeClass('muteOff');
    }
    
    function muteOff() {
        $('#'+muteSVGElemId).addClass('muteOff');
    }
    
    /**
     * popTopInteraction() removes the top <p> element from interactionLog
     */
    function popTopInteraction() {
        $('#'+interactionLogElemId).find('p:first').remove();
    }
    
    function noMic() {
        $('#'+muteWrapperElemId).hide();
    }
    
    function addToInteractionLog(text, isDavisSpeaking, typeWriter) {
        
        if (typeWriter) {
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
     * typeText() forwards text to be added to interactionLog using a type-writer animation
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
     * submitTextInput() submits text from textInput 
     * as a request in interactWithRuxit() when the Enter key is pressed
     * 
     * Used for chat mode
     * 
     * @param {Integer} keyCode
     */
    function submitTextInput(keyCode) {
        
        if (keyCode == 13) {
            
            davisController.interactWithRuxit($('#'+textInputElemId).val());
            resetTextInput();
            $('#'+textInputElemId).attr('placeholder', '');
            
        }
        
    }
        
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
        }
        
    };
    
})()