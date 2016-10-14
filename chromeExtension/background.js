var isConnected = false;
var debugMode = false;
var sockets = [];

// Listen for extension button clicks
chrome.browserAction.onClicked.addListener( tab => { 
	
	if (isConnected && sockets.length > 0) {
		sockets[0].disconnect();
	} else {
		
		getOptions(true)
			.then( options => {
				getSocket(options);
			}).catch( err => {
				console.log(err);
			});
	}
});

// Listen for changes to saved extension options
chrome.storage.onChanged.addListener( function (changes, namespace) {
	getOptions(true)
		.then( options => {
			getSocket(options);
		}).catch( err => {
			console.log(err);
		});
});

function updateStatus(status, url) {
		isConnected = (status === 'connected');	
		
		if (status === 'error') userSocket = null;
		
		var title = (!isConnected) ? 'Connect to Davis' : 'Disconnect from Davis';
		if (status === 'error') title = `Unable to connect to: ${url}`;
		
		chrome.browserAction.setIcon({
			path: `${status}.png`
		});
		chrome.browserAction.setTitle({
			title: title
		});
}

function getOptions(isClicked) {
	return new Promise( (resolve, reject) => {
		chrome.storage.sync.get({
			davisUrl: '',
			userId : '',
			debugMode: ''
		}, (options) => {
			
			debugMode = options.debugMode;
			
			if ((!options || options.davisUrl.length == 0 || options.userId.length == 0) && isClicked) {
				chrome.browserAction.setIcon({
					path: `error.png`
				});
				chrome.browserAction.setTitle({
					title: 'Please enter missing values in this extension\'s options modal'
				});
				chrome.runtime.openOptionsPage();
				reject();
			}
			
			resolve(options);
		});
	});
}

function getSocket(options) {
	return new Promise( (resolve, reject) => {
		
		var socket;
		
		if (options.davisUrl.length > 0) {
								
			if (sockets.length == 0) {
				socket = io(options.davisUrl);
				sockets.push(socket);
			} else {
				sockets[0].disconnect();
				sockets = [];
				socket = io(options.davisUrl);
				sockets.push(socket);	
			}			
			
			// Navigate to URL in current tab
			socket.on(`url-${options.userId}`, url => {
				console.log('sockets.length: '+sockets.length);
				// Ensure only one socket opens a URL
				if (socket.id === sockets[0].id) {
					
					if(options.debugMode) console.log('Request to navigate to page ' + url);
					
					chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
				
						// if current tab includes 'dynatrace' use current tab, else open new tab 
						if (url !== tabs[0].url && tabs[0].url.includes('dynatrace')) {
							chrome.tabs.update(tabs[0].id, {url: url});
						} else {
							chrome.tabs.create({ url: url });
						}
					});
				}
			});
			
			// Shared socket connection established
			socket.on('connect', () => {
				if (debugMode) console.log('Connected to server via socket.io');
				updateStatus('connected');
				socket.emit('registerAlexa', {id: socket.id, alexa: options.userId});
				resolve(socket);
			});
			
			// Shared socket connection established
			socket.on('reconnect', () => {
				if (debugMode) console.log('Reconnected to server via socket.io');
				updateStatus('connected');
			});
			
			// Shared socket disconnected
			socket.on('disconnect', () => {
				if (debugMode) console.log('Disconnected from server via socket.io');
				updateStatus('disconnected');
			});
			
			// Shared socket connection failed
			socket.on('connect_error', (err) => {
				if (debugMode) {
					console.log('Connection to server via socket.io failed: connect_error');
					console.log(err);
				}
				updateStatus('error', options.davisUrl);
				reject(err);
			});
			
			// Shared socket connection failed
			socket.on('connect_timeout', () => {
				if (debugMode) console.log('Connection to server via socket.io failed: connect_timeout');
				updateStatus('error', options.davisUrl);
			});
			
			// Shared socket connection failed
			socket.on('reconnect_error', (err) => {
				if (debugMode) {		
					console.log('Connection to server via socket.io failed: reconnect_error');
					console.log(err);
				}
				updateStatus('error', options.davisUrl);
			});
			 
		}
	
	});
}

getOptions(false)
	.then( options => {
		getSocket(options);
	}).catch( err => {
		console.log(err);
	});