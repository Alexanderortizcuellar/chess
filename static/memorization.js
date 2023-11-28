import {Board} from "./board.js"
let board = new Board("startpos", 1024)
let menu = document.querySelector("div.mem-menu-wrapper")
let menuOptions = menu.querySelectorAll("div.menu-opt")
let containers = document.querySelectorAll("div.memorize-con")
let statusBar = document.querySelector("div.memorize-status-bar")
//colors
let coord = document.querySelector("div.memorize-coord p")
let colorOptions = document.querySelectorAll("div.memorize-options-wrapper button")

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
		return 
	}
		const drgImg = document.createElement("img")
		let src = getImgSrc(square.style.backgroundImage)
		square.style.backgroundImage = "url('')"
		drgImg.src  = src
		e.dataTransfer.setData("text/plain", src)
		drgImg.width = 70
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

