let menuHider = document.querySelector("div.menu h3")
let menuToggle = document.querySelector("div.toggle-wrapper")

let menu = document.querySelector("div.menu")
menuToggle.addEventListener("click",()=>{
	menu.style.display = "none"
	if (menu.style.display=="none") {
		menu.style.display = "flex"
		menu.style.width = "70%"
	} else {
		menu.style.display = "none"
	}
})
menuHider.addEventListener("click", ()=>{
	menu.style.display = "none"
})
