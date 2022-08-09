function winningArray (pieces) {
	// A win happens when the three items in the array are the same, and they are not 0.
	// The array is passed in as an argument.
	// The function returns true if the array contains three of the same pieces, and false otherwise.
	let win = false;
	if (pieces[0].getOwner() !== 0 && pieces[0].getOwner() === pieces[1].getOwner() && pieces[0].getOwner() === pieces[2].getOwner()) {
		win = true;
	}
	return win;
}

class TTTPiece {
	constructor(owner) {
		this.owner = owner; // 0 = none, 1 = player 1, 2 = player 2
	}

	getOwner() {
		return this.owner;
	}

	setOwner(owner) {
		this.owner = owner;
	}
}

class TTTBoard {
	constructor() {
		this.board = [];
		for (let i = 0; i < 3; i++) {
			this.board[i] = [];
			for (let j = 0; j < 3; j++) {
				this.board[i][j] = new TTTPiece(0);
			}
		}
	}

	getBoard() {
		return this.board;
	}

	setBoard(bd) {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (bd[i][j] === 1) {
					this.setPiece(i, j, new TTTPiece(1));
				} else if (bd[i][j] === 2) {
					this.setPiece(i, j, new TTTPiece(2));
				} else {
					this.setPiece(i, j, new TTTPiece(0));
				}
			}
		}
	}

	getPiece(i, j) {
		return this.board[i][j];
	}

	setPiece(i, j, piece) {
		this.board[i][j] = piece;
	}

	getRow(i) {
		return this.board[i];
	}

	getColumn(j) {
		let column = [];
		for (let i = 0; i < 3; i++) {
			column.push(this.board[i][j]);
		}
		return column;
	}

	getDiagonalLeft() {
		let diagonal = [];
		for (let i = 0; i < 3; i++) {
			diagonal.push(this.board[i][i]);
		}
		return diagonal;
	}

	getDiagonalRight() {
		let diagonal = [];
		for (let i = 0; i < 3; i++) {
			diagonal.push(this.board[i][2 - i]);
		}
		return diagonal;
	}

	isEmpty(i, j) {
		return this.board[i][j].getOwner() === 0;
	}

	isFull() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.isEmpty(i, j)) {
					return false;
				}
			}
		}
		return true;
	}

	copy() {
		let board = new TTTBoard();
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				board.setPiece(i, j, this.getPiece(i, j));
			}
		}
		return board;
	}
}

class GameState {
	constructor() {
		this.board = new TTTBoard();
		this.turn = 1;
		this.winner = 0;
		this.moves = [];
	}

	isTerminal() {
		return this.winner !== 0 || this.board.isFull();
	}

	getWinner() {
		return this.winner;
	}

	calculateWinner() {
		let winner = 0;
		for (let i = 0; i < 3; i++) {
			if (winningArray(this.board.getRow(i))) {
				winner = this.board.getRow(i)[0].getOwner();
			}
			if (winningArray(this.board.getColumn(i))) {
				winner = this.board.getColumn(i)[0].getOwner();
			}
		}
		if (winningArray(this.board.getDiagonalLeft())) {
			winner = this.board.getDiagonalLeft()[0].getOwner();
		}
		if (winningArray(this.board.getDiagonalRight())) {
			winner = this.board.getDiagonalRight()[0].getOwner();
		}
		this.winner = winner;
	}

	isValidMove(i, j) {
		return this.board.isEmpty(i, j);
	}

	validMoves() {
		let moves = [];
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.isValidMove(i, j)) {
					moves.push([i, j]);
				}
			}
		}
		return moves;
	}

	makeMove(i, j) {
		if (this.isValidMove(i, j)) {
			this.board.setPiece(i, j, new TTTPiece(this.turn));
			this.turn = this.turn === 1 ? 2 : 1;
			this.moves.push([i, j]);
			this.calculateWinner();
			return true;
		} else {
			console.log("Position is not valid.");
			console.log("Valid moves: " + JSON.stringify(this.validMoves()));
			console.log("Tried to make move: " + i + ", " + j);
			return false;
		}
	}

	undoMove() {
		// Undo the last move.
		let lastMove = this.moves.pop();
		this.board.setPiece(lastMove[0], lastMove[1], new TTTPiece(0));
		this.turn = this.turn === 1 ? 2 : 1;
	}

	getBoard() {
		return this.board;
	}

	getTurn() {
		return this.turn;
	}

	getBoardAsString() {
		let boardString = "";
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.board.getPiece(i, j).getOwner() === 0) {
					boardString += " ";
				} else if (this.board.getPiece(i, j).getOwner() === 1) {
					boardString += "X";
				} else {
					boardString += "O";
				}
			}
			boardString += "\n";
		}
		return boardString;
	}

	copy() {
		let copy = new GameState();
		copy.board = this.board.copy();
		copy.turn = this.turn;
		copy.winner = this.winner;
		copy.moves = this.moves;
		return copy;
	}

	toString() {
		return this.getBoardAsString();
	}
}