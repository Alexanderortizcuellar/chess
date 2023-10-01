class Board {
	constructor(fen) {

		this.initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		this.fen = fen
		this.empty = 'url("")'
	}
	createBoard() {
		let board = [[]]
		let table = document.createElement("table")
		for (let i=0;i<8;i++) {
		   let row = document.createElement("tr")
		   for (let j=0;j<0;j++) {
			let td = document.createElement("td")
			row.appendChild(td)
		   }
			table.appendChild(tr)
		}
		return table
	}
	_handleClick(current) {
		let selected = document.querySelector("button.active")
		if (selected != null) {
			if (selected.id==current.id)	{

				current.classList.remove("active")
				return
			}
		} else {
			if (this._getImage(current.id) == this.empty) {
return
			}
		}
	}
	_getImage(id) {
		return document.querySelector(`button#${id}`)
	}

}
