let sliderReward = document.getElementById('slider-reward-input');
let sliderPenalty = document.getElementById('slider-penalty-input');
let sliderInitial = document.getElementById('slider-initial-input');

let sliderRewardValue = document.getElementById('reward-value');
let sliderPenaltyValue = document.getElementById('penalty-value');
let sliderInitialValue = document.getElementById('initial-value');

// Get the localStorage values
let rewardValue = localStorage.getItem('reward');
let penaltyValue = localStorage.getItem('penalty');
let initialValue = localStorage.getItem('initial');

// If the values are not set, set them to defaults
if (rewardValue === null) {
	rewardValue = 3;
	localStorage.setItem('reward', rewardValue);
}
if (penaltyValue === null) {
	penaltyValue = 1;
	localStorage.setItem('penalty', penaltyValue);
}
if (initialValue === null) {
	initialValue = 1;
	localStorage.setItem('initial', initialValue);
}

// Set the slider values
sliderReward.value = rewardValue;
sliderPenalty.value = penaltyValue;
sliderInitial.value = initialValue;

// Set the text values
sliderRewardValue.innerHTML = rewardValue;
sliderPenaltyValue.innerHTML = penaltyValue;
sliderInitialValue.innerHTML = initialValue;

// Attach the event listeners
sliderReward.addEventListener('change', function() {
	sliderRewardValue.innerHTML = sliderReward.value;
	localStorage.setItem('reward', sliderReward.value);
});

sliderPenalty.addEventListener('change', function() {
	sliderPenaltyValue.innerHTML = sliderPenalty.value;
	localStorage.setItem('penalty', sliderPenalty.value);
});

sliderInitial.addEventListener('change', function() {
	sliderInitialValue.innerHTML = sliderInitial.value;
	localStorage.setItem('initial', sliderInitial.value);
});

sliderReward.addEventListener('mousemove', function() {
	sliderRewardValue.innerHTML = sliderReward.value;
});

sliderPenalty.addEventListener('mousemove', function() {
	sliderPenaltyValue.innerHTML = sliderPenalty.value;
});

sliderInitial.addEventListener('mousemove', function() {
	sliderInitialValue.innerHTML = sliderInitial.value;
});

let resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
	localStorage.clear();
	window.location.reload();
});