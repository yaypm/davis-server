var socket;
var storedOptions;
var isConnected = false;
chrome.browserAction.onClicked.addListener( tab => { 
	if (isConnected) {
		if (socket) socket.disconnect();	
		updateStatus('disconnected');
	} else {
		getOptions();
		setTimeout( () => {
			if (!storedOptions || storedOptions.davisUrl.length == 0 || storedOptions.userId.length == 0) {
				chrome.browserAction.setIcon({
					path: `error.png`
				});
				chrome.browserAction.setTitle({
					title: 'Please enter missing values in this extension\'s options modal'
				});
				chrome.runtime.openOptionsPage();
			}
		}, 300);
	}
});

function updateStatus(status, url) {
		isConnected = (status === 'connected');	
		
		var title = (!isConnected) ? 'Connect to Davis' : 'Disconnect from Davis';
		if (status === 'error') title = `Unable to connect to: ${url}`;
		
		chrome.browserAction.setIcon({
			path: `${status}.png`
		});
		chrome.browserAction.setTitle({
			title: title
		});
}

function getOptions() {
	
	chrome.storage.sync.get({
		davisUrl: '',
		userId : '',
		debugMode: ''
	  }, (options) => {
		
		storedOptions = options;
		
		if (options.davisUrl.length > 0) {
								
			socket = io(options.davisUrl);		
			var socketLocal = socket;
			
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
				socketLocal.emit('registerAlexa', {id: socketLocal.id, alexa: storedOptions.userId});
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
				socket = null;
			});
			
			// Shared socket connection failed
			socket.on('connect_error', (err) => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: connect_error");
				if(options.debugMode) console.log(err);
				updateStatus('error', options.davisUrl);
				socket = null;
			});
			
			// Shared socket connection failed
			socket.on('connect_timeout', () => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: connect_timeout");
				updateStatus('error', options.davisUrl);
				socket = null;
			});
			
			// Shared socket connection failed
			socket.on('reconnect_error', (err) => {
				if(options.debugMode) console.log("Connection to server via socket.io failed: reconnect_error");
				if(options.debugMode) console.log(err);
				updateStatus('error', options.davisUrl);
				socket = null;
			});
			 
		}
	});
}

getOptions();

// Listen for changes to saved extension options
chrome.storage.onChanged.addListener( function (changes, namespace) {
	getOptions(); 
});