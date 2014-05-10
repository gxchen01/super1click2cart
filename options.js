
window.onload = function() {
	var KEY_URLS_STRING = 'string-item-urls';

	// Saves options to localStorage.
	function save_options() {
		var urls = document.getElementById('text-urls').value;
		if (urls == "") {
			//localStorage['item-urls'] = ""; /* it doesn't work if = null??? */
			localStorage.removeItem(KEY_URLS_STRING);
			alert('nothing will be saved..');
			return;
		}

		// we simply save the input text string,
		// when restore, we also simply display the stored string.
		// no need to convert to Array or any other JSON object.
		console.log("input text: " + urls);
		localStorage[KEY_URLS_STRING] = urls;

		alert("options saved!");
	}

	function restore_options() {

		var str_urls = localStorage[KEY_URLS_STRING];

		if (!str_urls) {
			return;
		}

		console.log("restore urls: " + str_urls);
		document.getElementById('text-urls').value = str_urls;
	}

	document.getElementById('save').addEventListener('click', save_options);

	restore_options();
}

