import {Chess} from "./js/dist/esm/chess.js"
import {Randomize, FirstLetter, GuessWord} from "./utils.js"


let cons = document.querySelectorAll("div.pgn-mem-con")

let buttons = document.querySelectorAll("div.menu-pgn-memorize button")



function processPgn(pgnText) {
	let moves = "";
	let chess = new Chess()
	chess.loadPgn(pgnText);
	chess.deleteComments();
	let movesSplit = pgnText.split(/\d+\./).join(" ").replace(/\s+/, " ").split(" ");
	for (const m of movesSplit) {
		if (m != "") {
			moves += m + " "
		} 
	}
	return moves;
}

let pgnText = ""
text = processPgn(pgnText)

let randomizer = new Randomize(text)
let Dragger = ""
let guesser = new GuessWord(text)


