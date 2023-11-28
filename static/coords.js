let buttons = document.querySelectorAll("button.sq")
let coordCon = document.querySelector("button.coord")

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
	let coord = letters[index]+number
	return coord
}


function handleCoord(userCoord) {
	let coordCon = document.querySelector("button.coord")
	coordCon.style.display = "block"
	if (coordCon.innerText == userCoord) {
		let randCoord = getRadomCoord()
		coordCon.innerText = randCoord
		setTimeout(() => {
			coordCon.style.display = "none"
		}, 800);
	} else {
		navigator.vibrate(150)

		setTimeout(() => {
			coordCon.style.display = "none"
		}, 600);

	}
}

function trackScore() {

}
