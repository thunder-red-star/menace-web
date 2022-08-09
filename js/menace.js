function flipVertical(board) {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardRow = [];
		for (let j = 0; j < 3; j++) {
			boardRow.push(board[i][2 - j]);
		}
		newBoard.push(boardRow);
	}
	return newBoard;
}

function rotateCounterClockwise(move) {
	// Rotate the move counterclockwise.
	let newX = move[1];
	let newY = 2 - move[0];
	return [newX, newY];
}

function rotateClockwise(move) {
	// Rotate the move clockwise.
	let newX = 2 - move[1];
	let newY = move[0];
	return [newX, newY];
}

let currentMenace;

function flipHorizontal(board) {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardRow = [];
		for (let j = 0; j < 3; j++) {
			boardRow.push(board[j][i]);
		}
		newBoard.push(boardRow);
	}
	return newBoard;
}

function rotate90(board) {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardRow = [];
		for (let j = 0; j < 3; j++) {
			boardRow.push(board[2 - j][i]);
		}
		newBoard.push(boardRow);
	}
	return newBoard;
}

let sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Is one array of arrays the same as another?
function isSame(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i].length !== b[i].length) return false;
		for (let j = 0; j < a[i].length; j++) {
			if (a[i][j] !== b[i][j]) return false;
		}
	}
	return true;
}

function contains(arr, target) {
	return arr.some(function (a) {
		return a.length === target.length && a.every(function (x, i) {
			return x === target[i]
		})
	})
}

function isUnique(existing, board) {
	let unique = true;
	for (let i = 0; i < existing.length; i++) {
		// First check: if the boards are the same
		if (isSame(existing[i], board)) {
			unique = false;
			break;
		}
		// Second check: Flip the board vertically
		board = flipVertical(board);
		if (isSame(existing[i], board)) {
			unique = false;
			break;
		}
		// Third check: Rotate the board 90 degrees three times, check each of those
		for (let j = 0; j < 3; j++) {
			board = rotate90(board);
			if (isSame(existing[i], board)) {
				unique = false;
				break;
			}
		}
		board = rotate90(board);
		// Fourth check: Flip the board vertically and rotate the board 90 degrees three times, check each of those
		board = flipVertical(board);
		for (let j = 0; j < 3; j++) {
			board = rotate90(board);
			if (isSame(existing[i], board)) {
				unique = false;
				break;
			}
		}
		board = rotate90(board);
	}
	return unique;
}

function validTicTacToe(g) {
	let o = 0, x = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (g[i][j] === '2') {
				o++;
			} else if (g[i][j] === '1') {
				x++;
			}
		}
	}
	if (win(g, '222')) {
		if (win(g, '111')) {
			return false;
		} else {
			return o === x;
		}
	} else {
		if (win(g, '111')) {
			return x - o === 1;
		} else {
			return o === x || x - o === 1;
		}
	}
};

const win = (g, pattern) => {
	for (const s of g) {
		if (s === pattern) return true;
	}
	for (let i = 0; i < 3; i++) {
		let colPattern = '';
		for (let j = 0; j < 3; j++) colPattern += g[j][i];
		if (colPattern === pattern) return true;
	}
	let diagonal = '', diagonal2 = '';
	for (let i = 0, j = 0; i < 3; i++, j++) diagonal += g[i][j];
	for (let i = 2, j = 0; j < 3; i--, j++) diagonal2 += g[i][j];
	return diagonal === pattern || diagonal2 === pattern;
};

let convert = (board) => {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardString = '';
		for (let j = 0; j < 3; j++) {
			if (board[i][j].getOwner() === 1) {
				boardString += '1';
			}
			if (board[i][j].getOwner() === 2) {
				boardString += '2';
			}
			if (board[i][j].getOwner() === 0) {
				boardString += '0';
			}
		}
		newBoard.push(boardString);
	}
	return newBoard;
}

let unconvert = (board) => {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardRow = [];
		for (let j = 0; j < 3; j++) {
			if (board[i].split('')[j] === '1') {
				boardRow.push(1);
			} else if (board[i].split('')[j] === '2') {
				boardRow.push(2);
			} else {
				boardRow.push(0);
			}
		}
		newBoard.push(boardRow);
	}
	return newBoard;
}

let base3toBoard = (base3) => {
	let numberBoard = [];
	for (let i = 0; i < 9; i++) {
		numberBoard.push(base3 % 3);
		base3 = Math.floor(base3 / 3);
	}
	// Now restructure the board to a 2d array
	let board = [];
	for (let i = 0; i < 3; i++) {
		let row = [];
		for (let j = 0; j < 3; j++) {
			row.push(numberBoard[i * 3 + j]);
		}
		board.push(row);
	}
	return board;
}

let boardToBase3 = (board) => {
	let base3 = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			base3 += (board[i][j].getOwner() || 0) * Math.pow(3, i * 3 + j);
		}
	}
	return base3;
}

function findAllStates() {
	let states = [];
	for (let i = 0; i < 3 ** 9; i++) {
		let gameState = new GameState();
		gameState.board.setBoard(base3toBoard(i));
		if (validTicTacToe(convert(gameState.board.getBoard()))) {
			if (isUnique(states, convert(gameState.board.getBoard()))) {
				states.push(convert(gameState.board.getBoard()));
			}
		}
	}
	return states;
}

function initWeights(initial) {
	let positions = findAllStates();
	let weights = {};
	for (let i = 0; i < positions.length; i++) {
		// For each position, get each possible move
		let gameState = new GameState();
		let fixedBoard = unconvert(positions[i])
		gameState.board.setBoard(fixedBoard);
		let moves = gameState.validMoves();
		let weightsArr = [];
		for (let j = 0; j < 3; j++) {
			weightsArr[j] = [];
			for (let k = 0; k < 3; k++) {
				if (contains(moves, [j, k])) {
					weightsArr[j][k] = initial;
				} else {
					weightsArr[j][k] = 0;
				}
			}
		}
		weights[boardToBase3(gameState.board.board)] = weightsArr;
	}
	return weights;
}

function transformToFind(board, weights) {
	// Find the board in the weights, by rotating it and flipping it until it is found
	let flipped = false;
	let rotatedCount = 0;
	// Is the board in the weights?
	if (weights[boardToBase3(board)]) {
		return {
			rotatedCount: 0,
			flipped: false,
		}
	}
	// Rotate it so we check for each clockwise rotation
	board = rotate90(board);
	rotatedCount++;
	for (let i = 0; i < 3; i++) {
		if (weights[boardToBase3(board)]) {
			return {
				rotatedCount: rotatedCount,
				flipped: false,
			}
		}
		board = rotate90(board);
		rotatedCount++;
	}
	// If rotated count is 4, reset it to 0 (because we rotated it 4 times)
	if (rotatedCount === 4) rotatedCount = 0;
	// Flip it so we check for each flip
	board = flipVertical(board);
	flipped = true;
	if (weights[boardToBase3(board)]) {
		return {
			rotatedCount: rotatedCount,
			flipped: true,
		}
	}
	// Rotate it so we check for each clockwise rotation
	board = rotate90(board);
	rotatedCount++;
	for (let i = 0; i < 3; i++) {
		if (weights[boardToBase3(board)]) {
			return {
				rotatedCount: rotatedCount,
				flipped: true,
			}
		}
		board = rotate90(board);
		rotatedCount++;
	}
	// We didn't find it, throw an error
	return undefined;
}

class Menace {
	// MENACE Tic Tac Toe AI
	constructor(weights, options = {}) {
		this.weights = weights || initWeights(options.initial);
		this.initialWeights = parseInt(options.initial) || 1;
		this.reward = parseInt(options.reward) || 3;
		this.penalty = parseInt(options.penalty) || 1;

		// If weights was a string, parse it.
		if (typeof this.weights === 'string') {
			this.weights = JSON.parse(this.weights);
		}
	}

	giveReward(board, move) {
		// Find the board in the weights, by rotating it and flipping it until it is found
		let transformed = transformToFind(board, this.weights);
		// Let's calculate the new board, and update the weights
		let newBoard = board;
		if (transformed.flipped) {
			newBoard = flipVertical(newBoard);
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newBoard = rotate90(newBoard);
		}
		// Now we'll calculate the move on the new board
		let newMove = move;
		if (transformed.flipped) {
			newMove = [newMove[0], 2 - newMove[1]];
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newMove = rotateCounterClockwise(newMove);
		}

		// Now we'll update the weights
		let x = this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]]
		x	+= this.reward;
		console.log(this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] + " --> reward " + x);
		this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] = x;
	}

	givePenalty(board, move) {
		// Find the board in the weights, by rotating it and flipping it until it is found
		let transformed = transformToFind(board, this.weights);
		// Let's calculate the new board, and update the weights
		let newBoard = board;
		if (transformed.flipped) {
			newBoard = flipVertical(newBoard);
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newBoard = rotate90(newBoard);
		}
		// Now we'll calculate the move on the new board
		let newMove = move;
		if (transformed.flipped) {
			newMove = [newMove[0], 2 - newMove[1]];
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newMove = rotateCounterClockwise(newMove);
		}

		// Now we'll update the weights
		let x = this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]]
		x	-= this.penalty;
		console.log(this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] + " --> penalty " + x);
		this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] = x;
	}

	giveDraw(board, move) {
		// Find the board in the weights, by rotating it and flipping it until it is found
		let transformed = transformToFind(board, this.weights);
		// Let's calculate the new board, and update the weights
		let newBoard = board;
		if (transformed.flipped) {
			newBoard = flipVertical(newBoard);
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newBoard = rotate90(newBoard);
		}
		// Now we'll calculate the move on the new board
		let newMove = move;
		if (transformed.flipped) {
			newMove = [newMove[0], 2 - newMove[1]];
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newMove = rotateCounterClockwise(newMove);
		}

		// Now we'll update the weights
		let x = this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]]
		x	+= (this.reward - this.penalty) / 2;
		console.log(this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] + " --> draw " + x);
		this.weights[boardToBase3(newBoard)][newMove[0]][newMove[1]] = x;
	}

	getMove(board) {
		let e = new GameState();
		e.board.board = board;
		console.log(e.getBoardAsString());
		// Find the board in the weights, by rotating it and flipping it until it is found
		let transformed = transformToFind(board, this.weights);
		// Let's calculate the new board.
		let newBoard = board;
		if (transformed.flipped) {
			newBoard = flipVertical(newBoard);
		}
		for (let i = 0; i < transformed.rotatedCount; i++) {
			newBoard = rotate90(newBoard);
		}
		let a = new GameState()
		a.board.board = newBoard;
		console.log("Rotations: " + transformed.rotatedCount + " Flipped: " + transformed.flipped);
		// Now we'll fetch the weights for the new board
		let movesWithWeights = [];
		// Now we'll build an array containing each bean, calculated by weight
		let beans = [];
		let w = this.weights[boardToBase3(newBoard).toString()];
		if (!w) {
			return undefined;
		}
		let bigArray = [];
		for (let i = 0; i < 3; i++) {
			let arr = [];
			for (let j = 0; j < 3; j++) {
				for (let k = 0; k < w[i][j]; k++) {
					beans.push(i * 3 + j);
				}
				if (w[i][j] > 0) {
					movesWithWeights.push([i, j]);
				}
				arr.push(w[i][j]);
			}
			bigArray.push(arr);
		}
		console.log(bigArray);
		for (let i = 0; i < transformed.rotatedCount; i++) {
			bigArray = rotate90(bigArray);
		}
		if (transformed.flipped) {
			bigArray = flipVertical(bigArray);
		}
		console.log(JSON.stringify(bigArray));
		let newMovesForDebugging = [];
		for (let i = 0; i < movesWithWeights.length; i++) {
			let newMove = movesWithWeights[i];
			for (let j = 0; j < transformed.rotatedCount; j++) {
				newMove = rotateClockwise(newMove);
			}
			if (transformed.flipped) {
				newMove = [newMove[0], 2 - newMove[1]];
			}
			newMovesForDebugging.push(newMove);
		}
		console.log("MENACE can play on these moves: " + JSON.stringify(newMovesForDebugging));
		// Now we'll randomly select a bean
		let bean = beans[Math.floor(Math.random() * beans.length)];
		// Now we'll convert the bean to a move
		let move = [Math.floor(bean / 3), bean % 3];
		// We must undo any transformations made to the board, so we can return the move
		for (let i = 0; i < transformed.rotatedCount; i++) {
			move = rotateClockwise(move);
		}
		if (transformed.flipped) {
			move = [move[0], 2 - move[1]];
		}

		console.log("MENACE plays: " + JSON.stringify(move));
		return move;
	}
}

createMenace = async () => {
	let status = document.getElementById('create-status');
	let initialWeight = parseInt(localStorage.getItem('initial')) || 1;
	let reward = parseInt(localStorage.getItem('reward')) || 3;
	let penalty = parseInt(localStorage.getItem('penalty')) || 1;
	await sleep(100);
	status.innerHTML = 'Figuring out all legal board positions...';
	await sleep(100);
	let allStates = findAllStates();
	await sleep(100);
	status.innerHTML = 'Weighting board states...';
	await sleep(100);
	let weights = initWeights(initialWeight);
	await sleep(100);
	status.innerHTML = 'Saving to local storage...';
	await sleep(100);
	currentMenace = new Menace(weights, {initial: initialWeight, reward: reward, penalty: penalty});
	await sleep(100);
	localStorage.setItem('weights', JSON.stringify(weights));
	status.innerHTML = 'MENACE initialized!';
}

let createButton = document.getElementById('create-button')

if (createButton) {
	createButton.addEventListener('click', createMenace);
}
