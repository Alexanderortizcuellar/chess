let buttons = document.querySelectorAll("button.sq")

for (const button of buttons) {
	button.addEventListener("click",(evt)=>{
	handleCoord(evt.currentTarget.id)	
})
}

function shuffle(list) {
                list.sort(()=>Math.random()-0.5)
                return list
        }

function getRadomCoord() {
	let letters = ["a","b", "c", "d","e","g","h"]
	letters = shuffle(letters)
	let number = Math.floor(Math.random()*(9-1)+1)
	number = number.toString()
	let index = Math.floor(Math.random()*7)
	console.log(index)
	let coord = letters[index]+number
	return coord
}


function handleCoord(userCoord) {
	let coord = document.querySelector("button.coord")
	coord.style.display = "block"
	if (coord.innerText == userCoord) {
		let randCoord = getRadomCoord()
		coord.innerText = randCoord
		setTimeout(() => {
			coord.style.display = "none"
		}, 800);
	} else {
		navigator.vibrate(150)

		setTimeout(() => {
			coord.style.display = "none"
		}, 600);

	}
}
