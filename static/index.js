import { Chess } from './js/dist/esm/chess.js'
import { Board } from './board.js'
var movemp3 = new Audio("/static/move.mp3")
var capturemp3 = new Audio("/static/capture.mp3")
var newgamemp3 = new Audio("/static/dong.mp3")
const sqs = document.querySelectorAll('button.sq');
let engine1
let engine2
let mode
let depth
let movePromotion // this holds the value of the move for the handleProm function 
let whitefirst = false;
let moveNumber = 1;
let coords = "";
let turn = 0;
let step = -1;
let historyStep = -1;
let initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
let loadedFen
let fen = initialFen;
let loaded = false;
let whitePlayer
let blackPlayer
document.querySelector("input#fen").value = initialFen

window.onload = ()=>{
	newGamedlg.showModal()
}
let pgnContainer = document.querySelector("div.pgn-container")

let newGamedlg = document.querySelector("dialog.newgame-dlg")

let newGameDlgBtn = document.querySelector("button#dlg-new-game-btn")
newGameDlgBtn.addEventListener("click", ()=>{
	configureGame()
})
let modeEntry = document.querySelector("select#mode")
let sideEntry = document.querySelector("select#side")
let eng1Entry = document.querySelector("select#engine")
let selfEng1Entry = document.querySelector("select#eng1")
let selfEng2Entry = document.querySelector("select#eng2")
let positionFenEntry = document.querySelector("input#fen-new-input")

let turnBoardBtn = document.querySelector(".turn-board")
turnBoardBtn.addEventListener("click", () => {
	swapBoard(fen)
})

let backBtn = document.querySelector("button.back-btn")
backBtn.addEventListener("click", ()=>{
	goBack()
})
let fwdBtn = document.querySelector("button.forwd-btn")
fwdBtn.addEventListener("click", ()=>{
	goFwd()
})

let fullFwdBtn = document.querySelector("button.full-forwd")
fullFwdBtn.addEventListener("click", ()=>{  
	goToMove("last")
})

let fullBackBtn = document.querySelector("button.full-back")
fullBackBtn.addEventListener("click", ()=>{  
	goToMove(0)
})
let newGamebtn = document.querySelector("button#new")

newGamebtn.addEventListener("click", () => {
	newGamedlg.showModal()	
})

let getBestMoveBtn = document.querySelector("button.help")

getBestMoveBtn.addEventListener("click", ()=> {
	getJsEngineMove()
})


let importBtn = document.querySelector("button.import")

importBtn.addEventListener("click", ()=>{
	importFen()
})

let optionsButton = document.querySelector("button.options")

let optsDlg = document.querySelector("dialog.options")

optionsButton.addEventListener("click", ()=>{
	optsDlg.showModal()
})

let btnExport = document.querySelector("button.export")
let dlgExport = document.querySelector("dialog.export-dlg")

btnExport.addEventListener("click", ()=>{
	dlgExport.showModal()
})

let exportPgnBtn = document.querySelector("button#export-pgn")
exportPgnBtn.addEventListener("click", ()=>{
	let currentPgn = getPgn()
	copyToClipBoard(currentPgn)
})
let exportFenBtn = document.querySelector("button#export-fen")
exportFenBtn.addEventListener("click", ()=>{
	copyToClipBoard(fen)
})

let exportImgBtn = document.querySelector("button#export-img")
exportImgBtn.addEventListener("click", ()=>{
	downloadImage()
})

let saveBtn = document.querySelector("button#save")
saveBtn.addEventListener("click", ()=>{
	save()
})

let playFromBtn = document.querySelector("button#play")
playFromBtn.addEventListener("click", ()=>{
	playEngine(fen)
})

let importFenDlgBtn = document.querySelector("button#fen-dlg-btn")


let fenDlgEntry = document.querySelector("input#fen-entry")
importFenDlgBtn.addEventListener("click", ()=>{
	newGame(fenDlgEntry.value)
	fen = fenDlgEntry.value;
	loadedFen = fenDlgEntry.value
	mode = "position"
})

let promBtns = document.querySelectorAll("dialog.dlg button")
	for (const b of promBtns) {
		b.addEventListener("click",()=>{
			handleProm(b)
		})
	}

function addCmdmoves() {
	let movesBtns = document.querySelectorAll("button.pgn-move-str")
	let count = 0;
	for (const b of movesBtns) {
		b.id = count
		b.addEventListener("click", ()=>{
		goToMove(parseInt(b.id))
		})
		count ++
	}
}
function addCommand() {
	let btns = document.querySelectorAll("button.sq")
	for (const sq of btns) {
		sq.addEventListener(
			'click', () => {
			try {
			    handleClick(sq);
			} catch (error) {
				console.log(error)
				}
			},);}
}

addCommand()

function getBoard(elements) {
	let stateBoard = [];
	for (const element of elements) {
		stateBoard.push([element.id, 
			element.style.backgroundImage, element.classList]);
	}

	return stateBoard
}


function handleClick(evt) {
	let previous = document.querySelector("button.active");
	if (previous!==null) {
		if (previous.id == evt.id) {
			clearValidMovesClass()
			evt.classList.remove("active")
			return
		}
		if (previous.style.backgroundImage == "url('')"){
			console.log("same")
			return
		}
		if (!checkTurn(turn, previous.style.backgroundImage)) {
			console.log("not turn")
			return
		}
		if (step != historyStep){
			console.log("different steps")
			return
		}
		// for invalid moves or promotion it returns false
		if (!validateMove(previous.id+evt.id)) {
			console.log(previous.id +evt.id)
			movePromotion = previous.id + evt.id
			return
		}
		handleCastle(previous.id+evt.id)
		 
		evt.classList.add("active")
		evt.style.backgroundImage = previous.style.backgroundImage
		previous.style.backgroundImage = "url('')"
		previous.classList.remove("active")
		evt.classList.remove("active")
		clearClass()
		previous.classList.add("movesFrom")
		evt.classList.add("movesTo")
		let who = getTurn(evt.style.backgroundImage)
		console.log(fen)
		toPGN(previous, evt, previous.id+evt.id)
		toFen(who)
		clearCheck()
		highlightCheck(fen)
		turn +=1
		clearValidMovesClass()
		movemp3.play()
		play()
	} else { 
		// if there's nothing with the activide class
	if (evt.style.backgroundImage == 'url("")') {
		return
		}
		if (!checkTurn(turn, evt.style.backgroundImage)) {
			return
		}
		//getMoves(fen)
		if (step == historyStep){
		hlValidMoves(evt.id)
		}
		evt.classList.add("active")
		getPosition(evt.id)
	}
	
}


function handleCastle(move) {
	let pos = [["e1","h1","g1","f1"],
		   ["e1","a1","c1","d1"],
		   ["e8","h8","g8","f8"],
		   ["e8","a8","c8","d8"]]
	for (const p of pos) {
		if (move == p[0]+p[2] && getPiece(p[0]).includes("king")) {
			changePiece(p[3], p[1])
			return true
		}
	}
	return false
}



function getPiece(coord) {
	let piece = document.querySelector("#"+`${coord}`).style.backgroundImage
	return piece
}

function changePiece(coord, to) {
	let toPiece = document.querySelector("#"+`${to}`)
	document.querySelector("#"+`${coord}`).style.backgroundImage = toPiece.style.backgroundImage
	toPiece.style.backgroundImage = "url('')"
}


function checkTurn(turn, clicked) {
	if (turn % 2 === 0 && clicked.includes("white")) {
		return true
	}
	if (turn % 2 != 0 && clicked.includes("black")) {
		return true
	}
	return false
}

function getTurn(clicked) {
	if (clicked.includes("white")) {
		return "b"
	} else {
		return "w"
	}
	
}

function clearClass() {
	let elementsMoved = document.querySelectorAll("button.movesFrom, button.movesTo")
	for (const e of elementsMoved) {
		e.classList.remove("movesTo")
		e.classList.remove("movesFrom")
	}
}

function clearValidMovesClass() {
	let all = document.querySelectorAll("button.sq")
	for (const b of all) {
		b.innerHTML = ""
	}
}




function toFen(turn) {
	let FEN = ""
	let arraysRows = {}
	let elements = document.querySelectorAll("button.sq")
	let state = getBoard(elements)
	let fenField = document.querySelector("input#fen");
	for (const element of state) {
	let key = element[0][1]
		if (arraysRows[key] === undefined) {
			arraysRows[key] = []
			arraysRows[key].push(nameParser(element[1]))
		} else {
			arraysRows[key].push(nameParser(element[1]))
		}
	}
	for (let i = 1; i<9;i++) {
		if (i<8) {
		FEN += processRow(arraysRows[9-i]) + "/"
		} else {
			FEN += processRow(arraysRows[9-i]) + ` ${turn} `;
		}		
	}
	FEN += checkRooks();
	FEN += " - 0 " + `${moveNumber}`
	fenField.value = FEN
	fen = FEN
	return FEN
}

function turnStrFromInt(turnInt) {
	if (turnInt % 2 == 0) {
		return "w"
	}
	return "b"
}

function nameParser(n) {
	let value
	if (n.includes("png")) {
		let name = n.split("/")[4].split(".")[0].split("_")
		if (name[1]==="white") {
			if (name[0]=="knight") {
				value = "N"
			} else {
			value = name[0][0].toUpperCase() }
		} else {
			if (name[0]=="knight") {
				value = "n"
			} else {
				value = name[0][0]
			}
			
		}
		return value
	} else {
		return ""
	}
}


function processRow(row) {
	if (whitefirst) {
		row = row.reverse()
	}
	let rowStr = "";
	let counter = 0;
	for (const item of row) {
		if (item==="") {
			counter+=1;
		} else {
		if (counter == 0) {
			counter = 0;
			} else {
				rowStr += counter.toString();
				counter = 0;
			}
			rowStr += item;
		}
	}
	if (counter > 0) {
		rowStr += counter.toString();
	}
	return rowStr
}

function checkRooks() {
	let castleRights = checkCastle()
	let caststr =  "";
	if (1===1) {
		caststr = castleRights
		return caststr
	}
	if (caststr==="") {
		return "-"
	}
	return caststr
}

function containsMove(position) {
	if (coords.includes(position)) {
		return true
	}
	return false
}
function checkCastle() {
	let castleRights = ""
	let poses = [
		["e1", "a1", "h1"],
		["e8", "a8", "h8"]
	]
	let whiteRights = checkCastleColor("white", poses[0])
	let blackRights = checkCastleColor("black", poses[1])
	if (whiteRights+blackRights === "") {
		castleRights = "-"
		return castleRights
	}
	castleRights = whiteRights + blackRights
	return castleRights
} 


function checkCastleColor(color, pos) {
	let castleRights = "KQ";
	let castleRookK = "K"
	let castleRookQ = "Q"
	let king = getPieceInfo(pos[0])
	if (!checkPiece(king,color,"king") || containsMove(pos[0])) {
		castleRights = ""
		return castleRights
	}
	let rookQ = getPieceInfo(pos[1])
	if (!checkPiece(rookQ, color,"rook") || containsMove(pos[1])) {
		 castleRookQ = ""
	}
	let rookK = getPieceInfo(pos[2])
	if (!checkPiece(rookK, color, "rook") || containsMove(pos[2])) {
		castleRookK = ""
	}
	castleRights = castleRookK +castleRookQ

	if (color == "black") {
		return castleRights.toLowerCase()	
	}
	return castleRights
}

function checkPiece(piece,color,type) {
	if (piece["color"] == color
	&& piece["type"] == type) {
		return true
	}
	return false
}
function getPieceInfo(coord) {
	let types = [
		"rook","queen","knight",
		"pawn","bishop","king",
	]
	let info = {
		"color":"",
		"type":"",
		"short-type":""
	}
	let p = getPiece(coord)
	if (p == "url('')") {
		return info
	} else if (p.includes("white")){
		info["color"] = "white"
	} else {
		info["color"] = "black"
	}

	for (const t of types) {
		if (p.includes(t)) {
			info["type"] = t
			break
		}
	}
	info["short-type"] = getShortType(p, info["color"], info["type"])
	return info
}

function getShortType(piece, color, type) {
	let pieceType = ""
	if (piece.includes("king")) {
		pieceType = "K"
	} else if (piece.includes("knight")) {
		pieceType = "N"
	} else {
		pieceType = type.slice(0,1)
	}
	if (color==="black") {
		return pieceType.toLowerCase()
	}
	return pieceType.toUpperCase()
}

function importFen() {
	let fendlg = document.querySelector(".fen-dlg")
	fendlg.showModal()
}

function toPGN(previous, evt, move) {
	if (evt.style.backgroundImage.includes("black")) {
		moveNumber +=1
		
	}
	historyStep += 1
	step += 1
	let coord = previous.id + evt.id + " ";
	if (move.length > 4) {
		coord = move+" "
	}
	coords += coord;
	let pngField = document.querySelector("input#pgn");
	pngField.value = coords
	addMovesTodiv()
	return coords
}

function addMovesTodiv() {
	let moves = pgnFromCoordsJs()
	pgnContainer.innerHTML = ""
	for (const [key, value] of Object.entries(moves)) {
		let mvs = value.trim().split(" ")
		let moveCon = document.createElement("span")
		moveCon.classList.add("pgn-move-con")
		let number = document.createElement("span")
		number.classList.add("pgn-move-int")
		number.innerText = key
		let moveStrW = document.createElement("button")
		let moveStrB = document.createElement("button")
		moveStrW.classList.add("pgn-move-str")
		moveStrW.innerText = mvs[0]
		moveCon.appendChild(number)
		moveCon.appendChild(moveStrW)
		if (mvs.length > 1) {
			moveStrB.innerText = mvs[1]
		moveStrB.classList.add("pgn-move-str")
			moveCon.appendChild(moveStrB)
		}
		pgnContainer.appendChild(moveCon)
	}
	addCmdmoves()
}

function pgnFromCoordsJs() {
	let fenstr = initialFen
	if (mode === 'position') {
		fenstr = loadedFen
	}
	if (loaded) {
		fenstr = loadedFen;
	}
	let pgnobjt = {}
	let moves  = coords.split(" ")
	moves = moves.slice(0, -1)
	let chess = new Chess(fenstr)
	for (const move of moves) {
		chess.move(move)
	}
	let pattern = new RegExp(/\d\./)
	let spltted = chess.pgn().split(pattern)

	for (let i=1;i<spltted.length;i++) {
		let movepgn = i.toString() + "."
		pgnobjt[movepgn] = spltted[i] 
	}
	return pgnobjt
}


function newGame(fenstr) {
	moveNumber = 1;
	coords = "";
	turn = 0;
	fen = initialFen;
	loadedFen = initialFen;
	historyStep = -1
	step = -1
	clearValidMovesClass()
	clearCheck()
	clearClass()
	document.querySelector("div.pgn-container").innerHTML = ""
	document.querySelector("input#fen").value = initialFen
	let b = new Board(fenstr)
	b.changeState(document.querySelector("div.container"))
}

function changeState(fenstr) {
	let b = new Board(fenstr)
	b.changeState(document.querySelector("div.container"))
	clearCheck()
	clearValidMovesClass()
	clearClass()
}

function getMovesJs(fenstring) {
	let moves = []
	let board = new Chess(fenstring)
	let movesData = board.moves({verbose:true})
	for (const field of movesData) {
		moves.push(field["lan"])
	}
	return moves
}

function validateMove(move) {
	// allowed moves has the suffix of the promotion piece
	let moves = getMovesJs(fen)
	for (const m of moves) {
		if (m.slice(0,4) == move){
		  if (m.length > 4) {
			doPromotion(move);
			return false
		  } 
		}
	}
	if (moves.includes(move)) {
		return true
	} 
	return false
}
// highlight valid moves as lichess
function hlValidMoves(current) {
	// filter moves to only the ones
	// for square under the cursor
	let moves = getMovesJs(fen)
	let all = document.querySelectorAll("button.sq")
	for (const b of all) {
		b.innerHTML = ""
	}
	let inhtml = '<span class="valid-move"></span>'
	let currentMoves = [];
	for (const move of moves) {
		if (move.slice(0,2) == current) {
			currentMoves.push(move)
		}
	}
	for (const move of currentMoves) {

		let tempb = document.querySelector("#"+move.slice(2,4))
		tempb.innerHTML = inhtml
	}
}

function highlightCheck(fenstr) {
	let king
	let board = new Chess(fenstr)
	if (board.isCheck()) {
		if (board.turn()=="b") {
			king = locateKing("black")	
		} else {
			king = locateKing("white")
	}
		king.style.boxShadow = "inset 0px 0px 14px 2px red"

}
}

function clearCheck() {
	let sqs = document.querySelectorAll("button.sq")
	for (const sq of sqs) {
		sq.style.boxShadow  = "none"
	}

}

function locateKing(color) {
	let sqs = document.querySelectorAll("button.sq")
	for (const sq of sqs) {
		let info = getPieceInfo(sq.id)
		if (info.type == "king" 
			&& 
		info.color == color) {
		    return sq	
		}
	}
}

// function to create promotion events
// who is to check what color is having the promotion it uses the event when first clicking the square after verifying
// valid moves in the 'getMoves' function


// now to access the move I needed to create a global variable to hold its value since we are executing a script when the dialog buttons are pressed.

function doPromotion(move) {
	let who = "white";
	if (move.includes("1")) {
		who = "black"
	}
	let whiteCon = document.querySelector("div.white-prom");
	let blackCon = document.querySelector("div.black-prom");

	if (who == "white") {
		blackCon.classList.remove("prom-active")
		whiteCon.classList.add("prom-active")
		blackCon.style.display = "none"
		whiteCon.style.display = "flex"
	} else {
		whiteCon.classList.remove("prom-active")
		blackCon.classList.add("prom-active")
		whiteCon.style.display = "none"
		blackCon.style.display = "flex"
	}
	let dlg = document.querySelector("dialog.dlg");
	dlg.showModal();
}


function handleProm(b) {
	b.id = "p1"
	let move = movePromotion;
	document.querySelector("#"+move.slice(2, 4)).style.backgroundImage = b.style.backgroundImage
	clearClass()
	let src = document.querySelector("#"+move.slice(0,2))
	let target = document.querySelector("#"+move.slice(2,4))
	src.style.backgroundImage = "url('')"
	src.classList.remove("active")
	src.classList.add("movesFrom")
	target.classList.add("movesTo")
	toFen(getTurn(b.style.backgroundImage))
	let piecepromType = getPieceInfo("p1")["short-type"].toLowerCase()
	toPGN(src, target, move+piecepromType)
	clearCheck()
	highlightCheck(fen)
	clearValidMovesClass()
	turn += 1
	play()
	b.id = ""
}


// automatic moves stuff
// to control the moves when they come from an engine

function doPromotionAut(move) {
	let path = "/static/svg/2048/"
	let proms = {
		"q":"queen_white.png",
		"b":"bishop_white.png",
		"n":"knight_white.png",
		"r":"rook_white.png"
	}
	let src = document.getElementById(move.slice(0,2))
	let target = document.getElementById(move.slice(2,4))
	let promPiece = path+ proms[move.slice(4)]
	if (move.includes("1")) {
		promPiece = promPiece.replace("white", "black")
	}
	let who = getTurn(src.style.backgroundImage)
	src.style.backgroundImage = "url('')"
	target.style.backgroundImage = `url('${promPiece}')`;
	window.alert(promPiece)
	toFen(who)
	toPGN(src, target, move)
	clearCheck()
	highlightCheck(fen)
	turn+=1
	if (mode==="self") {
		play()
	}
}


function updateState(move) {
	clearClass()
	if (move.length > 4) {
		doPromotionAut(move)
		return
	}
	handleCastle(move)
	let src = document.querySelector("#"+move.slice(0,2))
	let target = document.getElementById(move.slice(2, 4))
	target.style.backgroundImage = src.style.backgroundImage
	let who = getTurn(src.style.backgroundImage)
	src.style.backgroundImage = "url('')"
	src.classList.add("movesFrom")
	target.classList.add("movesTo")
	toFen(who)
	toPGN(src, target, move)
	clearCheck()
	highlightCheck(fen)
	turn+=1
	movemp3.play()
	if (mode==="self") {
		play()
	}
}

// this function gets a random move from the list of allowed moves
function getRandomMove(fenstr) {
	let moves = getMovesJs(fen)
	let rand = Math.floor(Math.random() * moves.length)
	return moves[rand]
}


function getJsEngineMove() {
	let who = turnStrFromInt(turn)
	toFen(who)
	let worker = new Worker("static/stockfish.js")
	worker.onmessage = function(e) {
		 parseMove(e.data)
	}
	worker.postMessage("uci")
	worker.postMessage("ucinewgame")
	worker.postMessage(`position fen ${fen}`)
	worker.postMessage("go depth 16")
}

function parseMove(moves) {
	if (moves.includes("bestmove")) {
		window.alert(moves)		
	}
}

//swap board through post request
function swapBoard(fenstr) {
	fetch("/swap", {
		method: 'POST',
		body: JSON.stringify({"fen":fenstr, "whitefirst":whitefirst}),
		headers: {'Content-Type': 'application/json'},

	})
		.then(response => response.json())
		.then(data => { 
			let con =  document.querySelector("div.container")
			con.innerHTML = data["data"]
			if (whitefirst) {
				whitefirst = false
			} else {
				whitefirst = true
			}
			addCommand()
		})

		.catch(error => {
			console.log(error);
		});
}

function configureGame() {
	if (modeEntry.value==="board") {
		newGame(initialFen)
		mode = modeEntry.value
	}
	if (modeEntry.value==="position"){
		newGame(positionFenEntry.value)
		mode = modeEntry.value
		loadedFen = positionFenEntry.value
		fen = loadedFen
	
		let chess = new Chess(fen)
		if (chess.turn()=="w") {
			turn = 0
		} else {
			turn = 1
		}
	}
	if (mode==="random") {
		newGame(initialFen)
		mode=modeEntry.value
	}
	if (modeEntry.value=="engine") {
		newGame(initialFen)
		mode=modeEntry.value
		engine1 = eng1Entry.value

		if (sideEntry.value=="black") {
			getEngineMove(engine1)
			whitePlayer = engine1
			blackPlayer = "Alexander"
		} else {
			whitePlayer = "Alexander"
			blackPlayer = engine1
		}
	}
	if (modeEntry.value=="self") {
		newGame(initialFen)
		mode = "self"
		engine1 = selfEng1Entry.value
		engine2 = selfEng2Entry.value
	}
	newgamemp3.play()
}

function play() {
	if (mode=="board") {
		return
	}
	if (mode=="engine") {
		getEngineMove(engine1)
	}
	if (mode=="random") {
		let move = getRandomMove(fen)
		updateState(move)
	}
	if (mode=="position") {
		return
	}
	if (mode=="self") {
		if (turn % 2 ==0) {
		getEngineMove(engine1)
		} else {
		getEngineMove(engine2)
		}
	}
}
function resolveFen() {
	if (mode=="position" || loaded == true) {
		return loadedFen
	} else {
		return initialFen
	}
}

function getPgn() {
	let fenstr = resolveFen()
	let board = new Chess(fenstr)
	playMoves(board)
	return board.pgn()
}


function getEngineMove(engine) {
	let who = turnStrFromInt(turn)
	toFen(who)
	console.log(fen)
	let worker = new Worker("static/worker.js")
	worker.onmessage = function(e) {
		let move = e.data["data"]["data"]
		updateState(move)
	}
	worker.postMessage({"engine":engine, "fen":fen})

}

function playMoves(board) {
	let moves = coords.split(" ")
	moves = moves.slice(0,-1)
	for (const move of moves) {
		board.move(move)
	}
}

function highlightMove(index) {
	let btns = document.querySelectorAll("button.pgn-move-str")
	btns = Array.from(btns)
	for (const move of btns) {
		move.style.background = "transparent"
	}
	btns[`${index}`].style.backgroundColor = "rgb(0,183,255)"
	btns[`${index}`].scrollIntoView()
	
}
function goFwd() {
	let fenstr = resolveFen()
	let board = new Chess(fenstr)
	playMoves(board)
	let history = board.history({"verbose":true})
	if (historyStep < history.length-1) {
		historyStep += 1
		let fencur = history[historyStep].after
		fen = fencur
		changeState(fencur)
		movemp3.play()
		highlightMove(historyStep)
	}

}



function goBack() {
	let fenstr = resolveFen()
	let board = new Chess(fenstr)
	playMoves(board)
	let history = board.history({"verbose":true})
	if (historyStep >  0) {
		historyStep -= 1
		let fencur = history[historyStep]["after"]
		fen = fencur
		changeState(fencur)
		highlightMove(historyStep)
		undoMove(fencur)
	}
	
}

function goToMove(move) {
	let fenstr = resolveFen()
	let board = new Chess(fenstr)
	playMoves(board)
	let history = board.history({"verbose":true})
	if (move == "last") {
	    move = history.length - 1
	}
	let fencur = history[move].after
	changeState(fencur)
	highlightMove(move)
	historyStep = move
	fen = fencur
}


function copyToClipBoard(text) {
	navigator.clipboard.writeText(text).then(()=>{
		console.log(text)
	}, ()=>{
		console.log("error")
	})
}

function download() {
	const a = document.createElement("a")
	const url = "/static/image.gif"
	a.href = url
	a.download = url.split("/").pop()
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
}

function downloadImage() {
	fetch("/download", {
		method: 'POST',
		body: JSON.stringify({"fen":fen}),
		headers: {'Content-Type': 'application/json'},

	})
		.then(response => response.json())
		.then(data => { 
			download()
		})

		.catch(error => {
			console.log(error);
		});
}

function getPosition(coord) {
	let element = document.querySelector(`button#${coord}`)
	let pos = element.getBoundingClientRect()
	let t = ""
	let info = pos.toJSON()

	for (const [k,v] of Object.entries(info)) {
	t += `${k}: ${v}\n`
	}
	//document.querySelector("span.info").innerText = t
}

function save() {
	let currentpgn = getPgn()
	let white = "white"
	let black = engine1
	let winner = "-"
	fetch("/save", {
		method: 'POST',
		body: JSON.stringify({"white":whitePlayer,"black":blackPlayer,"pgn":currentpgn,"winner":winner}),
		headers: {'Content-Type': 'application/json'},

	})
		.then(response => response.json())
		.then(data => { 
			console.log("saved!")
		})

		.catch(error => {
			console.log(error);
		});
}

function undoMove(fen) {
	let chess = new Chess(fen)
	if (chess.turn()=="w") {
		turn = 0
	} else {
		turn = 1
	}
	moveNumber = chess.moveNumber()
	step = historyStep;
	chess.reset()
	let mainFen = resolveFen()
	chess.load(mainFen)
	playMoves(chess)
	let history = chess.history({"verbose":true})
	coords = ""
	for (let i=0;i<step+1;i++) {
		coords += history[i].lan + " "
		console.log(coords)
	}
	changeState(fen)
	addMovesTodiv()
}

function readPgn(pgn) {
	let chess = new Chess()
	chess.loadPgn(pgn)
	let history = chess.history({"verbose":true})
	coords = ""
	for (let i=0;i<step+1;i++) {
		coords += history[i].lan + " "
	}
	newGame(initialFen)
}

function playEngine(fen) {
	engine1 = "mess"
	mode = "engine"
	loaded = true;
}
