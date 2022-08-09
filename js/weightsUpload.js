let weightsUpload = document.getElementById('weights-upload');
let weightsUploadStatus = document.getElementById('upload-status');
// Attach an event listener to the button

weightsUpload.addEventListener('change', function() {
	// When it is clicked, we upload the weights as a JSON file
	let file = weightsUpload.files[0];
	let reader = new FileReader();
	reader.onload = function(e) {
		let weights = e.target.result;
		// We need to validate this file.
		// Try to parse it as JSON
		try {
			let json = JSON.parse(weights);
			// Check if the JSON has 765 keys
			if (!Object.keys(json).length === 765) {
				// If not, throw an error
				weightsUploadStatus.innerHTML = 'Not all states have weights! Is your file corrupted?';
			} else {
				// Check if each value is a 3x3 matrix
				let good = true;
				for (let key in json) {
					if (!Array.isArray(json[key]) || json[key].length !== 3 || !Array.isArray(json[key][0]) || json[key][0].length !== 3) {
						// If not, throw an error
						good = false;
						weightsUploadStatus.innerHTML = 'Incorrect weights! Is your file corrupted?';
					}
				} // End of for loop
				if (good) {
					// If it is valid, store it in localStorage
					localStorage.setItem('weights', weights);
					// And display a message
					weightsUploadStatus.innerHTML = 'Weights uploaded successfully';
				}
			}
		} catch (e) {
			console.log(e);
			weightsUploadStatus.innerHTML = 'This doesn\'t look like JSON to me';
		}
	}
	reader.readAsText(file);
});