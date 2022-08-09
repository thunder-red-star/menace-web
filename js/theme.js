let lightThemeLocation = "css/light-colors.css";
let darkThemeLocation = "css/dark-colors.css";

let moonIcon = '<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"\n' +
	'     stroke="#EBEBD3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"\n' +
	'     className="feather feather-moon">\n' +
	'    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>\n' +
	'</svg>';
let sunIcon = '<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="#3c3c3b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

// Load the local storage item if it exists
if (localStorage.getItem('theme')) {
	if (localStorage.getItem('theme') === 'dark') {
		document.getElementById('theme-css').href = darkThemeLocation;
		console.log('Dark theme loaded');
	} else {
		document.getElementById('theme-css').href = lightThemeLocation;
		console.log('Light theme loaded');
	}
} else {
	document.getElementById('theme-css').href = lightThemeLocation;
	localStorage.setItem('theme', 'light');
	console.log('Light theme loaded (default)');
}


// Create a theme switcher button
let themeSwitcher = document.createElement('button');
themeSwitcher.id = 'theme-switcher-button';
themeSwitcher.class = 'button';

// If the theme is dark, set the button to show the moon icon (img/svg/moon.svg)
if (localStorage.getItem('theme') === 'dark') {
	themeSwitcher.innerHTML = moonIcon;
} else {
	themeSwitcher.innerHTML = sunIcon;
}

// Create a function to toggle the theme
function toggleTheme() {
	if (localStorage.getItem('theme') === 'light') {
		document.getElementById('theme-css').href = darkThemeLocation;
		localStorage.setItem('theme', 'dark');
		console.log('Dark theme loaded');
		// Set the button to show the moon icon (img/svg/moon.svg)
		themeSwitcher.innerHTML = moonIcon;
	} else {
		document.getElementById('theme-css').href = lightThemeLocation;
		localStorage.setItem('theme', 'light');
		console.log('Light theme loaded');
		// Set the button to show the sun icon (img/svg/sun.svg)
		themeSwitcher.innerHTML = sunIcon;
	}
}

// Add the event listener to the button
themeSwitcher.addEventListener('click', toggleTheme);

// Add the button to the page
document.getElementById('theme-switcher').appendChild(themeSwitcher);