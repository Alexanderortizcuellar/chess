export class Parser {
	constructor() {
	}
	_getBoard(con) {
		let board = []
		let elements = con.querySelectorAll("button.sq")
		for (const e of elements) {
			board.push([e.id,e.style.backgroundImage])
		}
		return board
	}
	
	_processRow(row) {
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

	toFen(con) {
		let FEN = ""
		let arraysRows = {}
		let state = this._getBoard(con)
		for (const element of state) {
		let key = element[0][1]
			if (arraysRows[key] === undefined) {
				arraysRows[key] = []
				arraysRows[key].push(this._nameParser(element[1]))
			} else {
				arraysRows[key].push(this._nameParser(element[1]))
			}
		}
		for (let i = 1; i<9;i++) {
			if (i<8) {
			FEN += this._processRow(arraysRows[9-i]) + "/"
			} else {
				FEN += this._processRow(arraysRows[9-i]);
			}		
	}
		return FEN

	}

	_nameParser(n) {
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


}
