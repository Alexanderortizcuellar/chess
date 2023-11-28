let menuHider = document.querySelector("div.menu h3")
let menuToggle = document.querySelector("div.toggle-wrapper")

let menu = document.querySelector("body div.menu")
menuToggle.addEventListener("click",()=>{
	menu.style.display = "none"
	if (menu.style.display=="none") {
		//document.querySelector("body").style.opacity = "0.5"
		menu.style.display = "flex"
		menu.style.width = "90%"
	} else {
		menu.style.display = "none"
	}
})
menuHider.addEventListener("click", ()=>{
	menu.style.display = "none"
})
