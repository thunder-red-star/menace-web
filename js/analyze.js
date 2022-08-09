let trainingResults = document.getElementById('training-results');
let xTrainingResults = document.getElementById('x-training-results');
let oTrainingResults = document.getElementById('o-training-results');

const ctx = trainingResults.getContext('2d');
const ctxX = xTrainingResults.getContext('2d');
const ctxO = oTrainingResults.getContext('2d');

let arrayRange = (start, end) => {
	let arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}

let fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '[]');
let labels = arrayRange(0, fitnessData.length - 1);
let xFitnessData = JSON.parse(localStorage.getItem('xFitnessData') || '[]');
let oFitnessData = JSON.parse(localStorage.getItem('oFitnessData') || '[]');

let makeCharts = function (fitnessData, xFitnessData, oFitnessData) {
	const genFit = new Chart(ctx, {
		type: 'line',
		data: {
			labels: arrayRange(0, fitnessData.length - 1),
			datasets: [{
				label: 'General Fitness over time',
				data: fitnessData,
				borderColor: '#DB3069'
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					title: "Fitness"
				},
				x: {
					title: "Game #"
				}
			}
		}
	});

	const xFit = new Chart(ctxX, {
		type: 'line',
		data: {
			labels: arrayRange(0, xFitnessData.length - 1),
			datasets: [{
				label: 'X Fitness over time',
				data: xFitnessData,
				borderColor: '#F5D547'
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					title: "Fitness"
				},
				x: {
					title: "Game #"
				}
			}
		}
	});

	const oFit = new Chart(ctxO, {
		type: 'line',
		data: {
			labels: arrayRange(0, oFitnessData.length - 1),
			datasets: [{
				label: 'O Fitness over time',
				data: oFitnessData,
				borderColor: '#1446A0'
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
					title: "Fitness"
				},
				x: {
					title: "Game #"
				}
			}
		}
	});
	return [genFit, xFit, oFit];
}

let destroyCharts = function (charts) {
	for (let i = 0; i < charts.length; i++) {
		charts[i].destroy();
	}
}

let charts = makeCharts(fitnessData, xFitnessData, oFitnessData);