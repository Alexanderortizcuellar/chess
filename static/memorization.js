import {Board} from "./board.js"
import {Parser} from "./parser.js"
let board = new Board("startpos", 1024)
let menu = document.querySelector("div.mem-menu-wrapper")
let menuOptions = menu.querySelectorAll("div.menu-opt")
let containers = document.querySelectorAll("div.memorize-con")
let statusBar = document.querySelector("div.memorize-status-bar")
//colors
let coord = document.querySelector("div.memorize-coord p")
let colorOptions = document.querySelectorAll("div.memorize-options-wrapper button")
let outerWrapper = document.querySelector("div.outer-wrapper")
outerWrapper.style.display = "none"
let boardRep = document.querySelector("div.board-rep-wrapper")
let barProgress = document.querySelector("div.rep-bar div#progress")
let editorBoard = document.querySelector("div.chessboard-wrapper")

let editorSubmitBtn = document.querySelector("div.button-editor-wrap")
editorSubmitBtn.style.display = "none"
let boardPiecesCon = document.querySelector("div.board-pieces-wrapper")
let submitRepBtn = document.querySelector("button#submit-rep")
submitRepBtn.onclick = ()=>{
	if(checkBoard()) {
		fetchFen()
	} else {
		navigator.vibrate(200)
	}
}
let presentation = document.querySelector("div.presentation")
let startRepBtn = document.querySelector("button#start-rep")
startRepBtn.addEventListener("click", ()=>{
	fetchFen()
})

window.onload = () => {
	coord.innerHTML = getRandomCoord()
}

for (const child of menuOptions) {
	child.addEventListener("click", (evt)=>{
		switchGames(evt.target)

	})
}

for (const colorOpt of colorOptions) {
	colorOpt.addEventListener("click", (evt)=>{
		checkColor(evt.target)
	})
}

function switchGames(current) {
	for (const con of containers) {
	con.style.display = "none"
	}
	menu.style.display = "none"
	let currentClass = Array.from(current.classList)[1]
	console.log(currentClass)
	for (const con of containers) {
		if (con.id === currentClass) {
			statusBar.style.display = "flex"
			con.style.display = "flex"
		} else {
			console.log(con.id)
		} 
	}
}

function showMenu() {
	menu.style.display = "flex"

}

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

function addNewCoord() {
	let newcoord = getRandomCoord();
	coord.innerHTML = newcoord;
}

function checkColor(colorInput) {
	let color = board.getSquareColor(coord.innerHTML.trim())

	if (color === colorInput.id) {
		addNewCoord()
	} else {
		navigator.vibrate(100)
	}
}

// board replication

const pieces = document.querySelectorAll("button.draggable")
const squares = document.querySelectorAll("div.chessboard-wrapper button.sq")

pieces.forEach(piece =>{
	piece.addEventListener("dragstart", (e)=>{
		const drgImg = document.createElement("img")
		let src = getImgSrc(piece.style.backgroundImage)
		drgImg.src  = src
		e.dataTransfer.setData("text/plain", src)
		drgImg.width = 70
		e.dataTransfer.setDragImage(drgImg, 50, 70)
	})

	piece.addEventListener("dragend", (e)=>{
			
	})
	
})

squares.forEach((square)=>{
	square.addEventListener("dragstart", (e)=>{
		if (square.style.backgroundImage==="url('')" || square.style.backgroundImage ==="") {
		console.log("hello")
		return 
	}
		const drgImg = document.createElement("img")
		let src = getImgSrc(square.style.backgroundImage)
		square.style.backgroundImage = "url('')"
		drgImg.src  = src
		e.dataTransfer.setData("text/plain", src)
		drgImg.width = 72
		e.dataTransfer.setDragImage(drgImg, 50, 70)
	})
	square.addEventListener("drop", (e)=>{
		e.preventDefault()
		let url = e.dataTransfer.getData("text/plain")
		console.log(url)
		square.style.backgroundImage = `url(${url})`
		square.style.opacity = "1"

	})
	square.addEventListener("dragover", (e)=>{
		e.preventDefault()
	})
	square.addEventListener("dragenter", (e)=>{
		square.style.opacity = "0.5"
	})
	square.addEventListener("dragleave", (e)=>{
		square.style.opacity = "1"
	})

})

function getImgSrc(src) {
	let pattern = new RegExp(/url\(["']?(.*?)["']?\)/)
	let srcImage= pattern.exec(src)[1]
	return srcImage
}

function fetchFen() {
	fetch("/get-fen")
	.then((resp)=>{
		return resp.json()
	})
	.then((data)=>{
			let fen = data["data"]
		let board = new Board(fen, 1024)
		board.changeState(boardRep)
		presentation.style.display = "none"
		outerWrapper.style.display = "block"
		let p = 100;
		setInterval(()=>{

			barProgress.style.width = `${p}%`
			p -=0.125
		}, 75)
		setTimeout(()=>{
			outerWrapper.style.display = "none"
			editorSubmitBtn.style.display = "flex"
		}, 60000)
		
	})
	.catch((err)=>{
		console.log(err)
	})
}

function checkBoard() {
	let parser = new Parser()
	let fen = parser.toFen(boardRep)
	let inputFen = parser.toFen(editorBoard)
	if (fen==inputFen) {
		return true
	}
	return false
}


