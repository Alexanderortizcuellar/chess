let menuHider = document.querySelector("div.menu h3")
let menuToggle = document.querySelector("div.toggle-wrapper")
let menu = document.querySelector("body div.menu")
let board = document.querySelector("div.container")
let lis = menu.querySelectorAll("li a")
menuToggle.addEventListener("click",()=>{
	menu.style.width = "0%"
	resizeLis(false)
	if (menu.style.width=='0%') {
		//document.querySelector("body").style.opacity = "0.5"
		//menu.style.display = "flex"
		menu.style.width = "90%"
	
	//board.style.opacity = "0.4"
setTimeout(()=>{
	resizeLis(true)}, 250)
	} else {
		//menu.style.display = "none"
		resizeLis(false)
		menu.style.width = "0%"
	}
})
menuHider.addEventListener("click", ()=>{
	menu.style.width = "0%"
	resizeLis(false)
	//board.style.opacity = "1"
})

function resizeLis(makeBig) {
	lis = Array.from(lis)
	lis.map((li)=>{
		if (makeBig) {
			li.style.color = "white"
		} else {
			li.style.color = "transparent"
		}
	})
}
