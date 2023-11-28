import {Chess} from "./js/dist/esm/chess.js"
import {Board} from "./board.js"

let chess = new Chess()
class Memorize {
	constructor(settings, fen) {
		this.settings
		this.fen = fen;
		this.board = new Board(fen);
	}
	createBoard() {
		console.log(this.board.board)
	}
	createQuestions() {
		let questions = {
			"where":"Where was ","1":"Was there a ($) on (#)","howmany":"how many pieces where on the board", "whatpiece":"What piece was on (#)","bestmove":"What is the best move?","check":"Was a king in check?","mate":"was there checkmate?","perspective":"What was the board perspective?","findmate":"Find mate in one", "cancapture":"Can the ($) on (#) capture the ($2) in (#2) in one move?"
		}
	}
	findQuestions() {
		let data = {}
		
	}

	getNumberPieces() {
		let number = 0;
		let firstFen = this.fen.split(" ", 1)[0];
		for (const c of firstFen) {
			if (this._isLetter(c)) {
				number +=1
			}
		}
		return number
	}


	_isLetter(character) {
		let pattern = new RegExp(/[A-Za-z]+/);
		let match = pattern.exec(character)
		if (match==null) {
			return false
		} else {
			return true
		}
	}
}
