// This adds a hamburger menu to the page.

let menu = [
	{
		name: 'Home',
		link: 'index.html'
	},
	{
		name: 'About',
		link: 'about.html'
	},
	{
		name: 'Play',
		link: 'play.html'
	},
	{
		name: 'Train',
		link: 'train.html'
	},
	{
		name: 'Load',
		link: 'load.html'
	},
	{
		name: 'Analyze',
		link: 'analyze.html'
	}
]

let hamburgerButton = document.getElementById('hamburger-button');

// Create a function to toggle the menu
function toggleMenu() {
	// The menu should slide in and out of the right side of the screen
	let menu = document.getElementById('menu-list');
	let navBlock = document.getElementById('navigation-block');
	let root = document.getElementById('root');
	if (menu.style.left === '0px') {
		menu.style.left = '-400px';
		navBlock.style.display = 'none';
		root.style.filter = 'blur(0px)';
		console.log('Menu hidden');
		hamburgerButton.classList.remove('menu-on');
	} else {
		menu.style.left = '0px';
		navBlock.style.display = 'block';
		root.style.filter = 'blur(2px)';
		console.log('Menu shown');
		hamburgerButton.classList.add('menu-on');
		// When the menu is shown, add an event listener to the root element to hide the menu when the user clicks outside of it
		navBlock.addEventListener('click', function(event) {
			if (event.target.id !== 'hamburger-button' && event.target.id !== 'menu-list') {
				menu.style.left = '-400px';
				navBlock.style.display = 'none';
				root.style.filter = 'blur(0px)';
				console.log('Menu hidden');
				hamburgerButton.classList.remove('menu-on');
			}
		});
	}
}

// Add the event listener to the button
hamburgerButton.addEventListener('click', toggleMenu);

// Construct the menu
let menuList = document.createElement('ul');
menuList.id = 'menu-list';
menuList.classList = ['menu-list'];

for (let i = 0; i < menu.length; i++) {
	let menuItem = document.createElement('li');
	menuItem.classList.add('menu-item', 'text-3xl');
	menuItem.innerHTML = '<p class="link2">' + menu[i].name + '</p>';
	menuItem.addEventListener('click', function() {
		window.location.href = menu[i].link;
	});
	menuList.appendChild(menuItem);
}

let themeSwitcherDiv = document.createElement('div');
themeSwitcherDiv.id = 'theme-switcher';
themeSwitcherDiv.classList.add('theme-switcher');

menuList.appendChild(themeSwitcherDiv);

// Add the menu to the page
document.body.appendChild(hamburgerButton);
document.body.appendChild(menuList);

