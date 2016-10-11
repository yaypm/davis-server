// Saves options to chrome.storage.sync.
function save_options() {
  var davisUrl = document.getElementById('davisUrl').value.trim();
  var userId = document.getElementById('userId').value.trim();
  var debugMode = document.getElementById('debugMode').checked;
  chrome.storage.sync.set({
    davisUrl: davisUrl,
    userId: userId,
	debugMode: debugMode
  }, function() {
    // Update status to let user know options were saved.
    document.getElementById('status').style.display = 'block';
	document.getElementById('save').style.display = 'none';
    setTimeout(function() {
		document.getElementById('status').style.display = 'none';
		document.getElementById('save').style.display = 'block';
		window.close();
    }, 500);
  });
}

// Restores settings from Chrome storage
function restore_options() {
  chrome.storage.sync.get({
		davisUrl: '', 
		userId: '',
		debugMode: ''
	}, function (options) {
		document.getElementById('davisUrl').value = options.davisUrl; 
		document.getElementById('userId').value = options.userId;
		document.getElementById('debugMode').checked = options.debugMode;
  });
}

function verifyFields(e){
	if (document.getElementById('davisUrl').value.trim().length > 0 
		&& document.getElementById('userId').value.trim().length > 0) {
		document.getElementById('save').disabled = false;
		if (e.keyCode == 13) {
			save_options();
		}
	} else {
		document.getElementById('save').disabled = true;
	}
}

// Event listeners for options page
document.addEventListener('DOMContentLoaded', restore_options, false);
document.getElementById('save').addEventListener('click', save_options, false);
document.getElementById('debugMode').addEventListener('click', verifyFields, false);
window.addEventListener("keyup", verifyFields, false);