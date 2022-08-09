// Train MENACE.
let fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '[]');
let xFitnessData = JSON.parse(localStorage.getItem('xFitnessData') || '[]');
let oFitnessData = JSON.parse(localStorage.getItem('oFitnessData') || '[]');

let trainButton1 = document.getElementById("train-button-1");
let trainButton10 = document.getElementById("train-button-10");
let trainButton100 = document.getElementById("train-button-100");
let trainButton1000 = document.getElementById("train-button-1000");
let trainStatus = document.getElementById("train-status");
let trainingProgress = document.getElementById("training-progress");

async function trainMenace(numberOfGames) {
	// Training entails self-play. We'll facilitate Tic Tac Toe games between MENACE and itself.
	let menaceWeights = localStorage.getItem('weights');
	let gamesPlayed = 0;
	let menacePlayer = new Menace(menaceWeights, {
		initial: parseInt(localStorage.getItem('initial')) || 1,
		reward: parseInt(localStorage.getItem('reward')) || 3,
		penalty: parseInt(localStorage.getItem('penalty')) || 1
	});
	trainingProgress.max = numberOfGames;
	trainingProgress.value = 0;
	for (let i = 0; i < numberOfGames; i++) {
		let xBoards = [];
		let xMoves = [];
		let oBoards = [];
		let oMoves = [];
		let game = new GameState();
		// Get before pseudo element of div progress bar
		trainingProgress.value = gamesPlayed + 1;
		trainStatus.innerHTML = "Starting game " + gamesPlayed + ".";
		console.log("Starting game " + (i + 1) + " of " + numberOfGames);
		while (!game.isTerminal()) {
			if (game.getTurn() === 1) {
				// MENACE's turn
				let move = menacePlayer.getMove(game.board.board);
				if (!move) {
					throw new Error("MENACE didn't make a move");
				}
				xBoards.push(game.copy());
				let success = game.makeMove(move[0], move[1]);
				if (!success) {
					throw new Error("MENACE made an invalid move");
				}
				xMoves.push(move);
			}
			else {
				// MENACE's turn
				let move = menacePlayer.getMove(game.board.board);
				if (!move) {
					throw new Error("MENACE didn't make a move");
				}
				oBoards.push(game.copy());
				let success = game.makeMove(move[0], move[1]);
				if (!success) {
					throw new Error("MENACE made an invalid move");
				}
				oMoves.push(move);
			}
		}
		// We've finished a game.
		// Get the winner.
		let winner = game.getWinner();
		if (winner === 1) {
			// X won.
			// Add the moves to the weights.
			console.log("X won!");
			for (let i = 0; i < xMoves.length; i++) {
				menacePlayer.giveReward(xBoards[i].board.board, xMoves[i]);
			}
			for (let i = 0; i < oMoves.length; i++) {
				menacePlayer.givePenalty(oBoards[i].board.board, oMoves[i]);
			}
		} else if (winner === 2) {
			// O won.
			// Add the moves to the weights.
			console.log("O won!");
			for (let i = 0; i < oMoves.length; i++) {
				menacePlayer.giveReward(oBoards[i].board.board, oMoves[i]);
			}
			for (let i = 0; i < xMoves.length; i++) {
				menacePlayer.givePenalty(xBoards[i].board.board, xMoves[i]);
			}
		} else {
			// Give both 1
			console.log("Tie!");
			for (let i = 0; i < xMoves.length; i++) {
				menacePlayer.giveDraw(xBoards[i].board.board, xMoves[i]);
			}
			for (let i = 0; i < oMoves.length; i++) {
				menacePlayer.giveDraw(oBoards[i].board.board, oMoves[i]);
			}
		}
		gamesPlayed++;
		// Console log a message.
		await sleep(1)
		console.log("Game " + (i + 1) + " of " + numberOfGames + " finished.");
		trainStatus.innerHTML = "Finished game " + gamesPlayed + ".";
	}
	// Save the weights.
	console.log("Saving weights.");
	trainStatus.innerHTML = "Saving weights.";
	localStorage.setItem('weights', JSON.stringify(menacePlayer.weights));
	trainStatus.innerHTML = "Training finished.";
}

// Add event listeners.
trainButton1.addEventListener("click", async () => {
	trainStatus.innerHTML = "Warming up...";
	await sleep(1);
	trainMenace(1);
});

trainButton10.addEventListener("click", async () => {
	trainStatus.innerHTML = "Warming up...";
	await sleep(1);
	trainMenace(10);
})

trainButton100.addEventListener("click", async () => {
	trainStatus.innerHTML = "Warming up...";
	await sleep(1);
	trainMenace(100);
})

trainButton1000.addEventListener("click", async () => {
	trainStatus.innerHTML = "Warming up...";
	await sleep(1);
	trainMenace(1000);
});