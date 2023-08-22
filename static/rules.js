function parseFen(fen) {
	let board = []
	let parts = fen.split(" ")
	let rows = parts[0].split("/")

	expandDigits(rows[0])
}

// expand the digits of the rank to white spaces
// first checks if there's any numbers
function expandDigits(rank) {
	let partint = []
	for (const letter of rank) {
		if (letter.match(/\d/)) {
			partint.push(" ")
		} else {
			partint.push(letter)
		}
	}
}

function createSpaces(n) {

}
parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1")

function checkPawn() {
	let g = 0;
}
