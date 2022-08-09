const validTicTacToe = (g) => {
	let o = 0, x = 0;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (g[i][j] === 'O') {
				o++;
			} else if (g[i][j] === 'X') {
				x++;
			}
		}
	}
	if (win(g, 'OOO')) {
		if (win(g, 'XXX')) {
			return false; // both win doesn't exist
		} else {
			return o === x; // o wins, x first, o second, when o wins, they are equal
		}
	} else {
		if (win(g, 'XXX')) {
			return x - o === 1; // x wins, x first, o second, when x wins, x moves first, so 1 more
		} else {
			return o === x || x - o === 1; // both not win, both conditions exist, if now x's turn, current o == x,  o's turn, x is 1 more
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

let convert = (numberBoard) => {
	let newBoard = [];
	for (let i = 0; i < 3; i++) {
		let boardString = '';
		for (let j = 0; j < 3; j++) {
			if (numberBoard[i][j] === 1) {
				boardString += 'X';
			}
			if (numberBoard[i][j] === 2) {
				boardString += 'O';
			}
			if (numberBoard[i][j] === 0) {
				boardString += ' ';
			}
		}
		newBoard.push(boardString);
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

let boards = [];

for (let x = 0; x < 3 ** 9; x++) {
	let board = base3toBoard(x);
	if (validTicTacToe(convert(board))) {
		// Convert the board back to a number
		let numberBoard = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				numberBoard.push(board[i][j]);
			}
		}
		boards.push(numberBoard);
	}
}

console.log(boards.length);