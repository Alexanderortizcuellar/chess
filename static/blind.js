import {Chess} from "./js/dist/esm/chess.js"
import {Board} from "./board.js"

let chess = new Chess()

let movesContainer = document.querySelector("div.moves-wrapper")
let userMove = document.querySelector("div#user-wrap button")
let EngineMove = document.querySelector("div#engine-wrap button")
let resetBtn = document.querySelector("button#reset")
let tabs = document.querySelectorAll("div.tools button")
let playContainer = document.querySelector("div.content-wrapper")
let chessBoard = document.querySelector("div.blind-board-wrapper")
let table = document.querySelector("table.table-moves")
let containers = document.querySelectorAll("div#container-blind")

window.onload = () => {
	addMoves()
}

for (const tab of tabs) {
	tab.addEventListener("click",
	(evt)=>{
		switchTab(evt.currentTarget)
	})
}

resetBtn.addEventListener("click", ()=>{
	chess.reset()
	userMove.innerHTML = ""
	EngineMove.innerHTML = ""
	table.querySelector("tbody").innerHTML = ""
	let board = new Board(chess.fen())
	board.changeState(chessBoard)
	addMoves()
})


function addMoves() {
	let moves = chess.moves()
	movesContainer.innerHTML = ""
	for (const m of moves) {
		createElement(m)
	}
}

function createElement(m) {
	let button = document.createElement("button")
	button.innerText = m
	button.classList.add("btn-move")
	button.addEventListener("click", (evt)=>{
		let move = evt.currentTarget.innerText
		updateState(move)
		userMove.innerText = move
		getEngineMove(chess.fen())
		addMoves()
	})
	movesContainer.appendChild(button)
}

function updateState(move) {
	chess.move(move)
	let board = new Board(chess.fen())
	board.changeState(chessBoard)
	pgnToTable()
}

function getEngineMove(fen) {
	let index = Math.floor(Math.random() * chess.moves().length)
	let move = chess.moves()[index]
	updateState(move)
	EngineMove.innerText = move

}

function hideTabs(active) {
	for (const con of containers) {
		con.style.display = "none"
	}
	active.style.display = "flex"
	if (active === playContainer) {
		active.style.display = "block"
	} 
}

function focusTab(tab) {
	for (const t of tabs) {
		t.classList.remove("tab-active")
	}
	tab.classList.add("tab-active")
}

hideTabs(playContainer)

function switchTab(tab) {
	let active = document.querySelector(`div.${tab.name}`)
	focusTab(tab)
	hideTabs(active)
}

function pgnToTable() {
	let moves
	let data = []
	table.querySelector("tbody").innerHTML = ""
	let pattern = new RegExp(/\d\./)
	let spltted = chess.pgn().split(pattern)

	for (let i=1;i<spltted.length;i++) {
		let movepgn = i.toString()
		moves = spltted[i].split(" ").slice(1, 3)
		moves.splice(0,0, movepgn)
		if (moves.length<3) {
			moves.push("")
		}
		insertRow(moves)
	}
}
function insertRow(data) {
	let row = document.createElement("tr")
	for (const m of data) {
		let td = document.createElement("td")
		td.innerText = m
		row.appendChild(td)
	}
	table.querySelector("tbody").appendChild(row)
}
