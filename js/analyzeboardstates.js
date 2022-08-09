// Toggle piece between empty and X or O, and add the event listener to each cell.

let currentBoardSelection = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

let togglePiece = function(i, j) {
	if (currentBoardSelection[i][j] === 0) {
		currentBoardSelection[i][j] = 1;
	} else if (currentBoardSelection[i][j] === 1) {
		currentBoardSelection[i][j] = 2;
	} else if (currentBoardSelection[i][j] === 2) {
		currentBoardSelection[i][j] = 0;
	}
	updateCellOnGameBoard(i, j, currentBoardSelection[i][j]);
	console.log(currentBoardSelection);
}

updateCellOnGameBoard = function (row, col, player) {
	let cell = document.getElementById(`cell1-${row}-${col}`);
	if (player === 1) {
		cell.innerHTML = xSvg;
	} else if (player === 2) {
		cell.innerHTML = oSvg;
	} else {
		cell.innerHTML = emptyCell;
	}
}

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		let gamePieceElement = document.getElementById(`cell1-${i}-${j}`);
		gamePieceElement.addEventListener('click', function() {
			// Clear all
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					updateCellOnGameBoard(i, j, currentBoardSelection[i][j]);
				}
			}
			togglePiece(i, j);
		});
	}
}

// Get the reset button
let resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', function() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			currentBoardSelection[i][j] = 0;
			updateCellOnGameBoard(i, j, currentBoardSelection[i][j]);
		}
	}
	// Also reset the contents of matchbox
	let matchbox = document.getElementById('matchbox');
	matchbox.innerHTML = '';
});



// Get the submit button
let submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function() {
	// Get the weights from the form
	let matchbox = document.getElementById('matchbox');
	let mbstatus = document.getElementById('matchbox-status');
	let weights = JSON.parse(localStorage.getItem('weights'));
	let gameState = new GameState();
	gameState.board.setBoard(currentBoardSelection);
	// Find the board in the weights, by rotating it and flipping it until it is found
	let transformed = transformToFind(gameState.board.board, weights);
	// Let's calculate the new board.
	let newBoard = gameState.board.board;
	if (!transformed) {
		mbstatus.innerHTML = "That's not a valid board.";
		return;
	}
	if (transformed.flipped) {
		newBoard = flipVertical(newBoard);
	}
	for (let i = 0; i < transformed.rotatedCount; i++) {
		newBoard = rotate90(newBoard);
	}
	let a = new GameState()
	a.board.board = newBoard;
	console.log(a.getBoardAsString());
	console.log("Rotations: " + transformed.rotatedCount + " Flipped: " + transformed.flipped);
	// Now we'll fetch the weights for the new board
	let movesWithWeights = [];
	// Now we'll build an array containing each bean, calculated by weight
	let beans = [];
	let w = weights[boardToBase3(newBoard).toString()];
	if (!w) {
		console.log("No weights found for this board");
		mbstatus.innerHTML = "That's not a valid board.";
	}
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let k = 0; k < w[i][j]; k++) {
				beans.push(i * 3 + j);
			}
		}
	}
	// We have to "rotate the beans" to match the new board
	let newBeans = [];
	for (let i = 0; i < beans.length; i++) {
		// We need to rotate the bean to match the new board. First convert the bean to a row and column
		let move = [Math.floor(beans[i] / 3), beans[i] % 3];
		let newMove = move
		for (let j = 0; j < transformed.rotatedCount; j++) {
			newMove = rotateClockwise(newMove);
		}
		if (transformed.flipped) {
			newMove = [newMove[0], 2 - newMove[1]];
		}
		// Turn the row and column back into a bean
		newBeans.push(newMove[0] * 3 + newMove[1]);
	}
	// Now we'll add all the colored beans to the matchbox.
	// Remove all the children of the matchbox
	while (matchbox.firstChild) {
		matchbox.removeChild(matchbox.firstChild);
	}
	for (let i = 0; i < newBeans.length; i++) {
		// Create a circle
		let circle = document.createElement('div');
		circle.className = 'circle inline-block';
		// Give it an ID corresponding to the bean
		circle.id = `bean-${newBeans[i]}`;
		// Add it to the matchbox
		matchbox.appendChild(circle);
	}
	// Now we want to put the bean counts in the grid.
	let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let i = 0; i < newBeans.length; i++) {
		counts[newBeans[i]]++;
	}
	console.log(counts);
	// For each count, convert it to coordinates, fetch the cell, and set the innerHTML
	for (let i = 0; i < counts.length; i++) {
		let row = Math.floor(i / 3);
		let col = i % 3;
		let cell = document.getElementById(`cell1-${row}-${col}`);
		if (counts[i] > 0) {
			// Create new p
			let p = document.createElement('p');
			p.innerHTML = counts[i].toString();
			if (counts[i] > 99) {
				p.className = 'bean-count description leading-tight text-[3.6rem] font-extrabold';
			} else if (counts[i] > 9) {
				p.className = 'bean-count description leading-tight text-[5rem] font-extrabold';
			} else {
				p.className = 'bean-count description leading-tight text-[6.5rem] font-extrabold';
			}
			cell.innerHTML = '';
			cell.appendChild(p);
		}
	}
	mbstatus.innerHTML = "Success!";
});