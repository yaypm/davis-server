var davisUrl;
var userId;
var sharedSocket;

function getOptions() {
	chrome.storage.sync.get({
		davisUrl: '',
		userId : ''
	  }, function(options) {
		
		if (options.davisUrl.length > 0) {
			
			davisUrl = options.davisUrl;
			userId = options.userId;						
			sharedSocket = io(davisUrl);
			
			// Navigate to URL in current tab
			sharedSocket.on('url-'+userId, function (url) {
				
				console.log("Request to navigate to page " + url);
				
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			
					// if current tab includes 'dynatrace' use current tab, else open new tab 
					if (url !== tabs[0].url && tabs[0].url.includes('dynatrace')) {
						chrome.tabs.update(tabs[0].id, {url: url});
					} else {
						chrome.tabs.create({ url: url });
					}
				});
			});
			
			// Shared socket connection established
			sharedSocket.on('connect', function () {
				// Make sure to only emit userOptions once if others connect to sharedSocket
				sharedSocket.emit('userOptions', {davisUrl: davisUrl, userId: userId});
			});
		}
	});
}

getOptions();

// Listen for changes to saved extension options
chrome.storage.onChanged.addListener( function (changes, namespace) {
	getOptions(); 
});