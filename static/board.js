export class Board {
	constructor(fen, quality) {

		this.colors = ["even", "odd"];
		this.startpos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		if (fen=="startpos") {
			fen = this.startpos;
		}
		this.fen  = fen;
		this.path = `/static/svg/${quality}/`
		this.mappins = {
		"P":"pawn_white.png",
		"R":"rook_white.png",
		"N":"knight_white.png",
		"B":"bishop_white.png",
		"Q":"queen_white.png",
		"K":"king_white.png",
		"":""
		}
		this.board  = [
	[{"coord":"a1","type":"R"},
	{"coord":"b1","type":"N"},
	{"coord":"c1","type":"B"},
	{"coord":"d1","type":"Q"},
	{"coord":"e1","type":"K"},
	{"coord":"f1","type":"B"},
	{"coord":"g1","type":"N"},
	{"coord":"h1","type":"R"},
	]
]
		this.letters = ["a","b","c","d","e","f","g","h"]
		this._addBlackMappings(this.mappins)
		this._fixTypes(this.board)
		this.state = this._fenToBoard(this.fen)
		this._addColors()
	}
	_addBlackMappings(maps) {
		for (const [key, value] of Object.entries(maps)) {
			let keyBlack = key.toLowerCase()
			let valueBlack = value.replace("white", "black")
			this.mappins[keyBlack] = valueBlack;
		}
	}
	_addPawns(color) {
		let pawns_row = [];
		let row = "2";
		let type = "P"
		if (color == "black") {
			row = "7"
			type = "p"
		}
		for (let i=0;i<8;i++) {
			let coord = this.letters[i] + row
			pawns_row.push({"coord":coord,"type":type})
		}
		return pawns_row
	}
	_addBlackPieces(white_row) {
		let black_row = [];
		for (const cell of white_row) {
			let coord = cell["coord"].replace("1", "8");
			let type = cell["type"].toLowerCase()
			black_row.push({"coord":coord, "type":type})
		}
		return black_row
	}
	_fixTypes(board) {
		board.push(this._addPawns("white"))
		for (const row of this._addBlanks()) {
			board.push(row);
		}
		board.push(this._addPawns("black"))
		board.push(this._addBlackPieces(board[0]))
		for (let row=0;row<8;row++) {
			for (let cell=0;cell<8;cell++) {
				board[row][cell]["image"] = this.path + this.mappins[board[row][cell]["type"]]
			}
		}
	board.reverse()
	}
	_addBlanks() {
		let rows = [];
		for (let i=3;i<7;i++) {
		  let temp_row = [];
		  for (let c=0;c<8;c++) {
			let objt = {"coord":this.letters[c]+i.toString(), "type":""}
			temp_row.push(objt)
		}
		rows.push(temp_row)
		}
		return rows
	}
	_fenToBoard(fen) {
		let path = this.path;
		let fenRows = []
		let splt = fen.split(" ", 1)
		let first = splt[0]
		let second = splt[1]
		let rows = first.split("/")
		for (const row of rows) {
			fenRows.push(this._cleanFenRow(row))
		}
		for (let row=0;row<8;row++) {
			for (let cell=0;cell<8;cell++) {
				this.board[row][cell]["type"] = fenRows[row][cell]
				if (this.board[row][cell]["type"] =="") {
				path = ""
				} else {
				 path = this.path;	
				}
				this.board[row][cell]["image"] = path + this.mappins[this.board[row][cell]["type"]] 
			}
		}	
	return this.board
	}
	_cleanFenRow(row) {
	    let cleanRow = []
	    for (const item of row) {
		    if (this._isDigit(item))	{
			    for (let i=0;i<parseInt(item);i++) {
				cleanRow.push("")
			    }
		    } else {
			cleanRow.push(item)
		    }
	    }
		return cleanRow
	}
	_isDigit(string) {
		let pattern = new RegExp(/\d/)
		if (pattern.exec(string) == null) {
			return false
		}
		return true
	}
	_addColors() {
		let colors = ["even", "odd"];
		for (let row=0;row<this.board.length;row++) {
			for (let cell=0;cell<8;cell++) {
				this.board[row][cell]["color"] = this._addCellColor(cell)
			}
		}
	}
	getSquareColor(square) {
		console.log(this.board)
		this.board.reverse()
		let row = parseInt(square.slice(1,2)) - 1

		let letter = square.slice(0,1);
		let col = this.letters.indexOf(letter)
		let color =  this.board[row][col]["color"]
		this.board.reverse()
		return 	color
	}
	
	_addCellColor(col) {
		let color = this.colors[0]
		this.colors.reverse()
		if (col == 7)  {
			this.colors.reverse()
		}
		return color
	}
	changeState(div) {
		for (let row=0;row<8;row++) {
			for (let cell=0;cell<8;cell++) {
				let id = this.board[row][cell]["coord"]
				let img = this.board[row][cell]["image"]  
				let sq = div.querySelector(`button#${id}`)
				sq.style.backgroundImage = `url("${img}")`
			}
		}	
	}
}

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


export class Formater {
	constructor() {
		this.time = 60000;
	}
	_createTime() {
		let secs = this.time / 1000;
		let [hours,left] = this._divmod(secs, 3600);
		let [minutes, secsLeft] = this._divmod(left, 60)
		let [seconds,millisLeft] = this._divmod(secsLeft, 1000)
		let milli = millisLeft;
		return [hours,minutes,seconds,milli]
	}
	formatTime(time) {
		this.time = time;
		const [hours,minutes,seconds,milli] = this._createTime()
		let timeFormatted = `${hours}:${minutes}:${seconds}`
		return timeFormatted
	}
	_divmod(n, divisor) {
		let quotient = Math.floor(n / divisor);
		let reminder = n % divisor;
		return [quotient,reminder]
	}
}
/*
startpos = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
let mem = new Memorize("", startpos)
mem.createQuestions()
*/
