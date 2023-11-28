//import { Board } from "./board.js"

class Piece {
	constructor(source) {
		this.source = source
		//this.board = new Board("startpos");
		this.letters = ["a","b","c","d","e","f","g","h"];
		this.numbers = [0,1,2,3,4,5,6,7]
	}
	getMoves() {
		
	}
	_encodeSource() {
		let parts = this.source.split(/([a-z])/)
		let row = parts[2]
		let col = parts[1]
		console.log([row,col])
		
	}
}

let piece = new Piece("e8")
piece._encodeSource()
