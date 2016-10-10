var socket;
var isConnected = false;
chrome.browserAction.onClicked.addListener( tab => { 
	if (isConnected) {
		socket.disconnect();
	} else {
		getOptions();
	}
});

function updateStatus(status) {
		isConnected = (status === 'connected');	
		chrome.browserAction.setIcon({
			path: `${status}.png`
		});
}

function getOptions() {
	
	chrome.storage.sync.get({
		davisUrl: '',
		userId : '',
		debugMode: ''
	  }, (options) => {
		
		if (options.davisUrl.length > 0) {
								
			socket = io(options.davisUrl);
			
			// Navigate to URL in current tab
			socket.on(`url-${options.userId}`, url => {
				
				if(options.debugMode) console.log("Request to navigate to page " + url);
				
				chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
			
					// if current tab includes 'dynatrace' use current tab, else open new tab 
					if (url !== tabs[0].url && tabs[0].url.includes('dynatrace')) {
						chrome.tabs.update(tabs[0].id, {url: url});
					} else {
						chrome.tabs.create({ url: url });
					}
				});
			});
			
			// Shared socket connection established
			socket.on('connect', () => {
				if(options.debugMode) console.log("Connected to server via socket.io");
				updateStatus('connected');
			});
			
			// Shared socket connection established
			socket.on('reconnect', () => {
				if(options.debugMode) console.log("Reconnected to server via socket.io");
				updateStatus('connected');
			});
			
			// Shared socket disconnected
			socket.on('disconnect', () => {
				if(options.debugMode) console.log("Disconnected from server via socket.io");
				updateStatus('disconnected');
			});
			
			// Shared socket connection failed
			socket.on('connect_error', (err) => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: connect_error");
				if(options.debugMode) console.log(err);
				updateStatus('error');
			});
			
			// Shared socket connection failed
			socket.on('connect_timeout', () => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: connect_timeout");
				updateStatus('error');
			});
			
			// Shared socket connection failed
			socket.on('reconnect_error', (err) => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: reconnect_error");
				if(options.debugMode) console.log(err);
				updateStatus('error');
			});
		}
	});
}

getOptions();

// Listen for changes to saved extension options
chrome.storage.onChanged.addListener( function (changes, namespace) {
	getOptions(); 
});