let analyticsUpload = document.getElementById('analytics-upload');
let analyticsUploadStatus = document.getElementById('analytics-upload-status');

// Attach an event listener to the button
analyticsUpload.addEventListener('change', function() {
	// When it is clicked, we upload the weights as a JSON file
	let file = analyticsUpload.files[0];
	let reader = new FileReader();
	reader.onload = function(e) {
		let weights = e.target.result;
		// We need to validate this file.
		// Try to parse it as JSON
		try {
			let json = JSON.parse(weights);

			// It should have three keys: fitnessData, xFitnessData, and oFitnessData
			if (!Object.keys(json).length === 3) {
				// If not, throw an error
				analyticsUploadStatus.innerHTML = 'Bad fitness data! Is your file corrupted?';
			} else {
				// Check if each key exists
				let validKeys = ['fitnessData', 'xFitnessData', 'oFitnessData'];
				let good = true;
				for (let key in json) {
					if (!validKeys.includes(key) || json[key] === null) {
						// If not, throw an error
						good = false;
						analyticsUploadStatus.innerHTML = 'Bad fitness data! Is your file corrupted?';
					}
				} // End of for loop
				if (good) {
					fitnessData = json.fitnessData;
					xFitnessData = json.xFitnessData;
					oFitnessData = json.oFitnessData;
					analyticsUploadStatus.innerHTML = 'Analytics uploaded successfully';
					destroyCharts(charts);
					charts = makeCharts(fitnessData, xFitnessData, oFitnessData);
				}
			}
		} catch (e) {
			console.log(e);
			analyticsUploadStatus.innerHTML = 'This doesn\'t look like JSON to me';
		}
	}
	reader.readAsText(file);
});