class Knight {
	constructor(source) {
		this.source = source
		//this.board = new Board("startpos");
		this.letters = ["a","b","c","d","e","f","g","h"];
		this.numbers = [1,2,3,4,5,6,7,8]
	}
	getMoves() {
		let moves = [];
		let candidates = []
		let [row,col] = this._encodeSource()
		let colIndex = this.letters.indexOf(col)
		if (row+2<=7&& colIndex+1<=7) {
			candidates.push([2, 1])
		}
		if (row+2<=7&& colIndex-1>=0) {
			candidates.push([2, -1])
		}
		if (row+1<=7&& colIndex-2>=0) {
			candidates.push([1, -2])
		}
		if (row+1<=7&& colIndex+2<=7) {
			candidates.push([1, 2])
		}

		if (row-1>=0&& colIndex-2>=0) {
			candidates.push([-1, -2])
		}
		if (row-1>=0&& colIndex+2<=7) {
			candidates.push([-1, +2])
		}
		if (row-2>=0&& colIndex-1>=0) {
			candidates.push([-2, -1])
		}
		if (row-2>=0 && colIndex+1<=7) {
			candidates.push([-2, 1])
		}


		for (const cnd of candidates) {
			let letter = this.letters[colIndex+cnd[1]]
moves.push(letter +((row+1) + cnd[0]))
		}
	return moves
	}
	_encodeSource() {
		let parts = this.source.split(/([a-z])/)
		let row = parseInt(parts[2])
		let col = parts[1]
		return [row-1, col]
	}
}

class Bishop {
	constructor(source) {
		this.source = source;
		this.letters = ["a","b","c","d","e","f","g","h"];
		this.numbers = [1,2,3,4,5,6,7,8]
		
	}
	getMoves() {
		let [row, col] = this._encodeSource(this.source);
	let moves = []
	let directions = [[1,1],[-1,-1],[1,-1],[-1,1]];
	for (const [dx,dy] of directions) {
	let newCol = col, newRow = row;
	while (true) {
	  newCol += dx;
	  newRow += dy;
		if (newCol >=1 && newCol<=8 && newRow >=1 && newRow<=8) {
		moves.push(this.letters[newCol-1]+ newRow.toString())
		} else {
			break
		}
	}
		}
	console.log(moves)
	}
	_encodeSource() {
		let parts = this.source.split(/([a-z])/)
		let row = parseInt(parts[2])
		let col = this.letters.indexOf(parts[1])
		return [row, col+1]
	}
}

let piece = new Bishop("e4")
piece.getMoves()
