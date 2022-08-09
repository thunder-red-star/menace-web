// Build the Game Board on the Play page.

let gameBoardDiv = document.getElementById('game');

// Now Tic Tac toe is a 3x3 grid. So we'll create a 3x3 grid.
let gameBoardElement = document.createElement('div');
gameBoardElement.classList.add('game-board');
gameBoardElement.classList.add('grid-flow-col')
gameBoardElement.classList.add('grid')
gameBoardElement.classList.add('grid-rows-3');

let xSvg = "<svg class=\"x\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"currentColor\"><path d=\"M0 0h24v24H0V0z\" fill=\"none\"/><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z\"/></svg>";
let oSvg = "<svg class=\"o\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"currentColor\"><g><rect fill=\"none\" height=\"24\" width=\"24\"/></g><g><path d=\"M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z\"/></g></svg>";
let emptyCell = "<svg class=\"empty\" xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"currentColor\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>";
for (let i = 0; i < 3; i++) {
	let gameRowElement = document.createElement('div');
	gameRowElement.classList.add('game-row');
	gameRowElement.classList.add('grid');
	gameRowElement.classList.add('grid-cols-3');
	for (let j = 0; j < 3; j++) {
		let gamePieceElement = document.createElement('div');
		gamePieceElement.classList.add('game-cell');
		gamePieceElement.id = `cell-${i}-${j}`;
		gamePieceElement.innerHTML = emptyCell;
		// Get the piece and set piece-id to the cell id

		// Add the event listener to the cell
		gameRowElement.appendChild(gamePieceElement);
	}
	gameBoardElement.appendChild(gameRowElement);
}
gameBoardDiv.appendChild(gameBoardElement);