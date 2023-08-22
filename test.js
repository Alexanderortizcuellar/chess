let board = []
let letters = "ABCDEFGH"

for (let i=0;i<8;i++) {
	let row = []
	for (let r=0;r<=8;r++) {
		row.push(letters[r]+(i+1).toString())
	}
	board.push(row.slice(0,-1))
	row.length =  0;

}





console.log(board)



