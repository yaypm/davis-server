// Saves options to chrome.storage.sync.
function save_options() {
  var davisUrl = document.getElementById('davisUrl').value.trim();
  var userId = document.getElementById('userId').value.trim(); 
  chrome.storage.sync.set({
    davisUrl: davisUrl,
    userId: userId
  }, function() {
    // Update status to let user know options were saved.
    document.getElementById('status').style.display = 'block';
	document.getElementById('save').style.display = 'none';
    setTimeout(function() {
		document.getElementById('status').style.display = 'none';
		document.getElementById('save').style.display = 'block';
    }, 750);
  });
}

// Restores settings from Chrome storage
function restore_options() {
  chrome.storage.sync.get({
		davisUrl: '', 
		userId: ''
	}, function (options) {
		document.getElementById('davisUrl').value = options.davisUrl; 
		document.getElementById('userId').value = options.userId;		
  });
}

// Event listeners for options page
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
window.addEventListener("keypress", verifyFields, false);


function verifyFields(e){
	if (document.getElementById('davisUrl').value.length > 0 
		&& document.getElementById('userId').value.length > 0) {
		document.getElementById('save').disabled = false;
	} else {
		document.getElementById('save').disabled = true;
	}
};