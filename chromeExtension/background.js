var socket;
var debugMode = false;

function getOptions() {
	chrome.storage.sync.get({
		davisUrl: '',
		userId : '',
		debugMode: ''
	  }, (options) => {
		  
		debugMode = (options.debugMode == 'true');
		
		if (options.davisUrl.length > 0) {
								
			socket = io(options.davisUrl);
			
			// Navigate to URL in current tab
			socket.on(`url-${options.userId}`, url => {
				
				if(debugMode) console.log("Request to navigate to page " + url);
				
				chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
			
					// if current tab includes 'dynatrace' use current tab, else open new tab 
					if (url !== tabs[0].url && tabs[0].url.includes('dynatrace')) {
						chrome.tabs.update(tabs[0].id, {url: url});
					} else {
						chrome.tabs.create({ url: url });
					}
				});
			});
			
			// Connection check
			/* socket.on(`connection-check-${options.userId}`, () => {
				if(debugMode) console.log("Connection check detected");
				socket.emit(`connected-${options.userId}`);
			}); */
			
			// Shared socket connection established
			socket.on('connect', () => {
				if(debugMode) console.log("Connected to server via socket.io");
			});
		}
	});
}

getOptions();

// Listen for changes to saved extension options
chrome.storage.onChanged.addListener( function (changes, namespace) {
	getOptions(); 
});