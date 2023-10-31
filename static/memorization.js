import {Board} from "./board.js"
let board = new Board("startpos")
console.log(board)
function shuffle(list) {
                list.sort(()=>Math.random()-0.5)
                return list
        }
function getRandomCoord() {
	let letters = ["a","b", "c", "d","e","g","h"]
	letters = shuffle(letters)
	let number = Math.floor(Math.random()*(9-1)+1)
	number = number.toString()
	let index = Math.floor(Math.random()*7)
	let coord = letters[index]+number
	return coord
}

console.log(board.getSquareColor(getRandomCoord()))
