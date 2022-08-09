let weightsDownload = document.getElementById('download-weights-button');
let analyticsDownload = document.getElementById('download-analytics-button');

// Weights are stored in localStorage as a JSON string
let weights = localStorage.getItem('weights');

function download(weights, json, applicationJson) {
	let a = document.createElement('a');
	a.download = json;
	a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(weights);
	a.innerHTML = 'Download weights';
	a.click();
}

// Attach an event listener to the button
weightsDownload.addEventListener('click', function() {
	// When it is clicked, we download the weights as a JSON file
	download(weights, 'weights.json', 'application/json');
});

function downloadAnalytics() {
	// First we have to build a JSON object with three keys:
	// - "fitnessData": an array
	// - "xFitnessData": an array
	// - "oFitnessData": an array
	let data = {
		fitnessData: JSON.parse(localStorage.getItem('fitnessData')),
		xFitnessData: JSON.parse(localStorage.getItem('xFitnessData')),
		oFitnessData: JSON.parse(localStorage.getItem('oFitnessData'))
	}
	// Convert to a JSON string
	let jsonString = JSON.stringify(data);
	// Download the JSON file
	download(jsonString, 'analytics.json', 'application/json');
}

// Attach an event listener to the button
analyticsDownload.addEventListener('click', function() {
	// When it is clicked, we download the analytics as a JSON file
	downloadAnalytics();
})

// We want to check if the user has weights saved in localStorage
// If they don't disable the download button
if (!weights) {
	weightsDownload.disabled = true;
}

// We want to check if the user has analytics saved in localStorage
// If they don't disable the download button
if (!localStorage.getItem('fitnessData') || !localStorage.getItem('xFitnessData') || !localStorage.getItem('oFitnessData')) {
	analyticsDownload.disabled = true;
}

// If these buttons are disabled, leave a message under them.
if (weightsDownload.disabled) {
	weightsDownload.innerHTML = 'No weights to download';
}

if (analyticsDownload.disabled) {
	analyticsDownload.innerHTML = 'No analytics to download';
}