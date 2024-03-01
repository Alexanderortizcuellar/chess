//import { Board } from "./board.js"

class Piece {
	constructor(source) {
		this.source = source
		//this.board = new Board("startpos");
		this.letters = ["a","b","c","d","e","f","g","h"];
		this.numbers = [1,2,3,4,5,6,7,8]
	}
	getMoves() {
		let moves = [];
		let candidates = []
		let [row,col] = this._encodeSource()
		let colIndex = this.letters.indexOf(col)
		if (row+2<=7&& colIndex+1<=7) {
			candidates.push([2, 1])
		}
		if (row+2<=7&& colIndex-1>=0) {
			candidates.push([2, -1])
		}
		if (row+1<=7&& colIndex-2>=0) {
			candidates.push([1, -2])
		}
		if (row+1<=7&& colIndex+2<=7) {
			candidates.push([1, 2])
		}

		if (row-1>=0&& colIndex-2>=0) {
			candidates.push([-1, -2])
		}
		if (row-1>=0&& colIndex+2<=7) {
			candidates.push([-1, +2])
		}
		if (row-2>=0&& colIndex-1>=0) {
			candidates.push([-2, -1])
		}
		if (row-2>=0 && colIndex+1<=7) {
			candidates.push([-2, 1])
		}


		for (const cnd of candidates) {
			let letter = this.letters[colIndex+cnd[1]]
console.log(letter +((row+1) + cnd[0]))
		}
	}
	_encodeSource() {
		let parts = this.source.split(/([a-z])/)
		let row = parseInt(parts[2])
		let col = parts[1]
		return [row-1, col]
	}
}

let piece = new Piece("g1")
piece.getMoves()
