// Handle all cell clicks and etc.
let currentGameState = null;
let humanPlayer = null;
let menacePlayer = null;

// Every time the user clicks New Game, the game board should be reset.
let playAsXButton = document.getElementById('play-as-x-button');
let playAsOButton = document.getElementById('play-as-o-button');

let gameStatus = document.getElementById('game-status');
let turnText = document.getElementById('turn-text');

let xMoves = [];
let oMoves = [];
let xBoards = [];
let oBoards = [];

let fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '[]');
let xFitnessData = JSON.parse(localStorage.getItem('xFitnessData') || '[]');
let oFitnessData = JSON.parse(localStorage.getItem('oFitnessData') || '[]');

playAsXButton.addEventListener('click', function (event) {
	xMoves = [];
	oMoves = [];
	xBoards = [];
	oBoards = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let cell = document.getElementById(`cell-${i}-${j}`);
			cell.innerHTML = emptyCell;
		}
	}
	humanPlayer = 1;
	currentGameState = new GameState();
	menacePlayer = new Menace(localStorage.getItem('weights'), {
		reward: localStorage.getItem('reward') || 3,
		penalty: localStorage.getItem('penalty') || 1,
		initial: localStorage.getItem('initial') || 1
	});
	turnText.innerHTML = 'It is your turn';
	gameStatus.innerHTML = 'Waiting for you to make a move...';
});

/*

 */

playAsOButton.addEventListener('click', async function (event) {
	xMoves = [];
	oMoves = [];
	xBoards = [];
	oBoards = [];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let cell = document.getElementById(`cell-${i}-${j}`);
			cell.innerHTML = emptyCell;
		}
	}
	humanPlayer = 2;
	currentGameState = new GameState();
	menacePlayer = new Menace(localStorage.getItem('weights'), {
		reward: localStorage.getItem('reward') || 3,
		penalty: localStorage.getItem('penalty') || 1,
		initial: localStorage.getItem('initial') || 1
	});
	// Since MENACE is playing X, we can call MENACE's getMove() function
	// to get its next move.
	turnText.innerHTML = 'It is MENACE\'s turn';
	gameStatus.innerHTML = 'Waiting for MENACE to make a move...';
	await sleep(50);
	let move = menacePlayer.getMove(currentGameState.board.board);
	console.log(`Menace player chose to play on row ${move[0]} and column ${move[1]}`);
	let newBoard = currentGameState.copy();
	xBoards.push(newBoard.board.board);
	xMoves.push(move);
	// Attempt to make the move
	let success = currentGameState.makeMove(move[0], move[1]);
	if (success) {
		updateCellOnGameBoard(move[0], move[1], 3 - humanPlayer);
		turnText.innerHTML = 'It is your turn';
		gameStatus.innerHTML = 'Waiting for you to make a move...';
	} else {
		gameStatus.innerHTML = 'MENACE crashed :(';
		throw new Error('MENACE made an invalid move');
	}
});

// this is so cute ngl, mini motorcycle sidecar with mg42 machine gun from ww2 in the 21st century

updateCellOnGameBoard = function (row, col, player) {
	let cell = document.getElementById(`cell-${row}-${col}`);
	if (player === 1) {
		cell.innerHTML = xSvg;
	} else if (player === 2) {
		cell.innerHTML = oSvg;
	} else {
		cell.innerHTML = emptyCell;
	}
}

let handleCellClick = async function (event) {
	currentGameState.calculateWinner();
	fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '[]');
	xFitnessData = JSON.parse(localStorage.getItem('xFitnessData') || '[]');
	oFitnessData = JSON.parse(localStorage.getItem('oFitnessData') || '[]');
	if (currentGameState.winner === 0) {
		if (currentGameState.turn === humanPlayer) {
			let cell = event.currentTarget;
			console.log(cell)
			// Get the cell coordinates
			console.log(cell.id)
			let cellCoordinates = cell.id.split('-');
			console.log(cellCoordinates);
			let row = parseInt(cellCoordinates[1]);
			let col = parseInt(cellCoordinates[2]);
			console.log(`Human player clicked on row ${row} and column ${col}`);
			// Attempt to make the move
			let boardCopy = currentGameState.copy();
			let success = currentGameState.makeMove(row, col);
			if (humanPlayer === 1) {
				xBoards.push(boardCopy.board.board);
				xMoves.push([row, col]);
			} else {
				oBoards.push(boardCopy.board.board);
				oMoves.push([row, col]);
			}
			if (!success) {
				gameStatus.innerHTML = 'Invalid move';
				if (humanPlayer === 1) {
					xMoves.pop();
					xBoards.pop();
				} else {
					oMoves.pop();
					oBoards.pop();
				}
				return;
			}
			currentGameState.calculateWinner();
			console.log(currentGameState);
			if (success) {
				updateCellOnGameBoard(row, col, humanPlayer);
				if (currentGameState.isTerminal()) {
					if (currentGameState.winner === humanPlayer) {
						gameStatus.innerHTML = 'You won!';
						if (humanPlayer === 1) {
							for (let i = 0; i < oMoves.length; i++) {
								menacePlayer.givePenalty(oBoards[i], oMoves[i]);
							}
						} else {
							for (let i = 0; i < xMoves.length; i++) {
								menacePlayer.givePenalty(xBoards[i], xMoves[i]);
							}
						}
						// Update game analytics.
						if (fitnessData.length === 0) {
							fitnessData = [-1]
						} else {
							fitnessData.push(fitnessData[fitnessData.length - 1] - 1);
						}
						if (humanPlayer === 1) {
							if (oFitnessData.length === 0) {
								oFitnessData = [-1]
							} else {
								oFitnessData.push(oFitnessData[oFitnessData.length - 1] - 1);
							}
						} else {
							if (xFitnessData.length === 0) {
								xFitnessData = [-1]
							} else {
								xFitnessData.push(xFitnessData[xFitnessData.length - 1] - 1);
							}
						}
						localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
						localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
						localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
					} else if (currentGameState.winner === 3 - humanPlayer) {
						gameStatus.innerHTML = 'You lost!';
						if (humanPlayer === 1) {
							for (let i = 0; i < oMoves.length; i++) {
								menacePlayer.giveReward(oBoards[i], oMoves[i]);
							}
						} else {
							for (let i = 0; i < xMoves.length; i++) {
								menacePlayer.giveReward(xBoards[i], xMoves[i]);
							}
						}
						// Update game analytics.
						if (fitnessData.length === 0) {
							fitnessData = [3]
						} else {
							fitnessData.push(fitnessData[fitnessData.length - 1] + 3);
						}
						if (humanPlayer === 1) {
							if (oFitnessData.length === 0) {
								oFitnessData = [3]
							} else {
								oFitnessData.push(oFitnessData[oFitnessData.length - 1] + 3);
							}
						} else {
							if (xFitnessData.length === 0) {
								xFitnessData = [3]
							} else {
								xFitnessData.push(xFitnessData[xFitnessData.length - 1] + 3);
							}
						}
						localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
						localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
						localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
					} else {
						// Give MENACE draw points
						if (humanPlayer === 1) {
							for (let i = 0; i < oMoves.length; i++) {
								menacePlayer.giveDraw(oBoards[i], oMoves[i]);
							}
						} else {
							for (let i = 0; i < xMoves.length; i++) {
								menacePlayer.giveDraw(xBoards[i], xMoves[i]);
							}
						}
						gameStatus.innerHTML = 'It was a tie!';
						if (fitnessData.length === 0) {
							fitnessData = [1]
						} else {
							fitnessData.push(fitnessData[fitnessData.length - 1] + 1);
						}
						if (humanPlayer === 1) {
							if (oFitnessData.length === 0) {
								oFitnessData = [1]
							} else {
								oFitnessData.push(oFitnessData[oFitnessData.length - 1] + 1);
							}
						} else {
							if (xFitnessData.length === 0) {
								xFitnessData = [1]
							} else {
								xFitnessData.push(xFitnessData[xFitnessData.length - 1] + 1);
							}
						}
						localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
						localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
						localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
					}
					localStorage.setItem('weights', JSON.stringify(menacePlayer.weights));
				}
				currentGameState.calculateWinner();
				if (!currentGameState.isTerminal()) {
					// Now we want MENACE to make a move
					await sleep(50);
					turnText.innerHTML = 'It is MENACE\'s turn';
					let boardCopy1 = currentGameState.copy();
					let move = menacePlayer.getMove(currentGameState.board.board);
					if (humanPlayer === 1) {
						oMoves.push(move);
						oBoards.push(boardCopy1.board.board);
					} else {
						xMoves.push(move);
						xBoards.push(boardCopy1.board.board);
					}
					if (!move) {
						gameStatus.innerHTML = 'MENACE crashed :(';
						oBoards.pop();
						throw new Error('MENACE didn\'t make a move (did it find a board?)');
					}
					if (isNaN(move[0])) {
						// MENACE has no moves left.
						gameStatus.innerHTML = 'MENACE has no weights left to play with!';
						return;
					}
					console.log(`Menace player chose to play on row ${move[0]} and column ${move[1]}`);
					// Attempt to make the move
					success = currentGameState.makeMove(move[0], move[1]);
					currentGameState.calculateWinner();
					if (currentGameState.isTerminal()) {
						if (currentGameState.winner === humanPlayer) {
							gameStatus.innerHTML = 'You won!';
							if (humanPlayer === 1) {
								for (let i = 0; i < oMoves.length; i++) {
									menacePlayer.givePenalty(oBoards[i], oMoves[i]);
								}
							} else {
								for (let i = 0; i < xMoves.length; i++) {
									menacePlayer.givePenalty(xBoards[i], xMoves[i]);
								}
							}
							// Update game analytics.
							if (fitnessData.length === 0) {
								fitnessData = [-1]
							} else {
								fitnessData.push(fitnessData[fitnessData.length - 1] - 1);
							}
							if (humanPlayer === 1) {
								if (oFitnessData.length === 0) {
									oFitnessData = [-1]
								} else {
									oFitnessData.push(oFitnessData[oFitnessData.length - 1] - 1);
								}
							} else {
								if (xFitnessData.length === 0) {
									xFitnessData = [-1]
								} else {
									xFitnessData.push(xFitnessData[xFitnessData.length - 1] - 1);
								}
							}
							localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
							localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
							localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
						} else if (currentGameState.winner === 3 - humanPlayer) {
							gameStatus.innerHTML = 'You lost!';
							if (humanPlayer === 1) {
								for (let i = 0; i < oMoves.length; i++) {
									menacePlayer.giveReward(oBoards[i], oMoves[i]);
								}
							} else {
								for (let i = 0; i < xMoves.length; i++) {
									menacePlayer.giveReward(xBoards[i], xMoves[i]);
								}
							}
							// Update game analytics.
							if (fitnessData.length === 0) {
								fitnessData = [3]
							} else {
								fitnessData.push(fitnessData[fitnessData.length - 1] + 3);
							}
							if (humanPlayer === 1) {
								if (oFitnessData.length === 0) {
									oFitnessData = [3]
								} else {
									oFitnessData.push(oFitnessData[oFitnessData.length - 1] + 3);
								}
							} else {
								if (xFitnessData.length === 0) {
									xFitnessData = [3]
								} else {
									xFitnessData.push(xFitnessData[xFitnessData.length - 1] + 3);
								}
							}
							localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
							localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
							localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
						} else {
							gameStatus.innerHTML = 'It was a tie!';
							if (humanPlayer === 1) {
								for (let i = 0; i < oMoves.length; i++) {
									menacePlayer.giveReward(oBoards[i], oMoves[i]);
								}
							} else {
								for (let i = 0; i < xMoves.length; i++) {
									menacePlayer.giveReward(xBoards[i], xMoves[i]);
								}
							}
							if (fitnessData.length === 0) {
								fitnessData = [1]
							} else {
								fitnessData.push(fitnessData[fitnessData.length - 1] + 1);
							}
							if (humanPlayer === 1) {
								if (oFitnessData.length === 0) {
									oFitnessData = [1]
								} else {
									oFitnessData.push(oFitnessData[oFitnessData.length - 1] + 1);
								} //
							} else {
								if (xFitnessData.length === 0) {
									xFitnessData = [1]
								} else {
									xFitnessData.push(xFitnessData[xFitnessData.length - 1] + 1);
								}
							}
							localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
							localStorage.setItem('oFitnessData', JSON.stringify(oFitnessData));
							localStorage.setItem('xFitnessData', JSON.stringify(xFitnessData));
						}
						localStorage.setItem('weights', JSON.stringify(menacePlayer.weights));
					}
					if (success) {
						updateCellOnGameBoard(move[0], move[1], 3 - humanPlayer);
						turnText.innerHTML = 'It is your turn';
					} else {
						gameStatus.innerHTML = 'MENACE crashed :(';
						throw new Error('MENACE made an invalid move');
					}
				} else {
					console.log('The game is over');
				}
			}
		} else {
			console.log('It is not your turn.');
		}
	} else {
		console.log('The game is over.');
	}
};

// Inject the event listener into each cell
for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		let cell = document.getElementById(`cell-${i}-${j}`);
		cell.addEventListener('click', handleCellClick);
	}
}

// Check if the user has set weights for the game.
if (!localStorage.getItem('weights')) {
	// Disable all buttons.
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let cell = document.getElementById(`cell-${i}-${j}`);
			cell.disabled = true;
		}
	}
	// Disable the reset button.
	playAsOButton.innerHTML = 'Create an AI first!'
	playAsOButton.disabled = true;
	playAsXButton.innerHTML = 'Create an AI first!'
	playAsXButton.disabled = true;
}