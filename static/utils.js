export class Randomizer {
	constructor(text) {
		this.text = text
		this.state = text
		this.classes = this._getClasses()
	}

	_getClasses() {
		let classes = []
		for (const verse of this.text) {
			let cls = new Randomize(verse["text"])
			classes.push(cls)
		}
		return classes
	}
	takeWords() {
		for (let i=0;i<this.text.length;i++) {
			this.classes[i].takeWords()
			this.state[i]["state"] = this.classes[i].state
		}
	}
	reset() {
		for (let i=0;i<this.text.length;i++) {
			this.classes[i].reset()
			this.state[i]["state"] = this.classes[i].state
		}
	}
}
export class Randomize {
	constructor(text) {
		this.text = text;
		this.words = text.split(" ")
		this.state = []
		this._wordsToObjt()
	}
	cleanWords() {
		
	}
	_wordsToObjt() {
		for (let i=0;i<this.words.length;i++) {
			let item = {"index":i,"text":this.words[i],"hidden":false}
			this.state.push(item)
		}
	}
	takeWords() {
		let percent = this.words.length >7 ? this.words.length * 0.19:this.words.length * 0.5
	let n = Math.floor(percent)
	for (let i=0;i<n;i++) {
		let available = this._checkState()	
		if (available.length>0) {
			let rand = available[Math.floor(Math.random() * available.length)]
			this._changeWordState(rand)
		}	
	}

	}
	_changeWordState(index) {
		for (const objt of this.state) {
			if (objt["index"] == index) {
				objt["hidden"] = true
			}
		}
	}
	_checkState() {
		let indexes = [];
		for (const objt of this.state) {
			if (objt["hidden"]==false) {
				indexes.push(objt["index"])
			}
		}
		return indexes
	}
	reset() {
		this.state = []
		this._wordsToObjt()
	}
}


export class GuessWord {
	constructor(text) {
		this.text = text;
		this.step = 0;
		this.state = [];
		this.words = this.text.split(" ")
		this.filteredWords = this._removeDuplicates(this.words)
		this._wordsToObjt()
	}

	_wordsToObjt() {
		for (let i=0;i<this.words.length;i++) {
			let item = {"index":i,"text":this.words[i],"options":this._addOptions(this.words[i]),"hidden":true}
			this.state.push(item)
		}
	}
	_shuffle(list) {
		list.sort(()=>Math.random()-0.5)
		return list
	}
	_addOptions(word) {
		let list = this.filteredWords.slice()
		this._removeWord(list, word)
		let opts = []
		let n
		if (this.words.length<4) {
			n = 1;
		} else if (this.words.length>=4 && this.words.length < 6) {
			n = 3
		} else {
			n = 4;
		}
		let available = this._checkState(list)
		for (let i=0;i<n;i++) {
			let [value,rand]  = this._choice(available)
			opts.push(list[value])
			available.splice(rand, 1)

		}
		let [_,randIndex] = this._choice(opts)
		opts.splice(randIndex,0, word)
		return this._shuffle(opts)
	}
	_checkState(list) {
		let indexes = []
		for (let i=0;i<list.length;i++) {
			indexes.push(i)
		} 	
		return indexes
	}
	_choice(list) {
		let rand = Math.floor(Math.random() * list.length)
		return [list[rand], rand]
	}
	_removeDuplicates(list) {
		return [...new Set(list)]
	}
	_removeWord(list, word) {
		let index = list.indexOf(word)
		list.splice(index, 1)
	}
	go(word) {
		if (word==this.state[this.step]["text"]) {
			this.state[this.step]["hidden"] = false;
			this.step += 1
			return true
		}
		return false
	}
	goFirst(word) {
		if (word[0]==this.state[this.step]["text"][0]) {
			this.state[this.step]["hidden"] = false;
			this.step += 1
			return true
		}
		return false
	}
	reset() {
		this.state = [];
		this.step = 0;
		this._wordsToObjt()
	}

}

export class GuessWords {
	constructor(text) {
		this.text = text;
		this.state = text;
		this.classes = this._getClasses()
		this._setState()
		this.step = 0;
		this.verseStep = 0;
		this.current = this.state[this.verseStep]
		this.currentWord = this.current["state"][this.step]["text"]
		this.currentOpts = this.current["state"][this.step]["options"]
	}
	_getClasses() {
		let classes = []
		for (const verse of this.text) {
		let cls = new GuessWord(verse["text"])
		classes.push(cls)
		}
		return classes
	}
	_setState() {
		for (let i=0;i<this.text.length;i++) {
			this.classes[i].reset()
			this.state[i]["state"] = this.classes[i].state
		}
	}
	_fixWord(word) {
		word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		let letter
		let pattern = new RegExp(/^[a-zA-Z-0-9]/)
		let matches = pattern.exec(word)
		if (matches==null && word.length>1) {
			letter = word[1]
		} else {
			letter = word[0]
		}

		return letter.toLowerCase()
	}
	go(wordGuess, first) {
			if (this.verseStep>=this.state.length) {
				this.currentOpts = []
				return false
			}
		let word = this.state[this.verseStep]["state"][this.step]["text"]
		if (first) {
		     word = this._fixWord(word)
		}
		if (wordGuess==word) {
			this.state[this.verseStep]["state"][this.step]["hidden"] = false;
			this.step +=1
			if (this.step>=this.state[this.verseStep]["state"].length) {
				this.verseStep +=1
				this.step = 0	
			}
			if (this.verseStep>=this.state.length) {
				this.currentOpts = []
				return true
			}
			this.current = this.state[this.verseStep]
			this.currentWord = this.current["state"][this.step]["text"]
			this.currentOpts = this.current["state"][this.step]["options"]
			return true
		}
		return false
	}
	reset() {
		this._setState()
		this.step = 0;
		this.verseStep = 0;
		this.current = this.state[this.verseStep]
		this.currentWord = this.current["state"][this.step]["text"]
		this.currentOpts = this.current["state"][this.step]["options"]
	}
}

export class FirstLetter {
	constructor(text) {
		// array of verses
		this.text = text;
	}
	_getLetter(word) {
		let chars = ["(","¡","¿"];
		let letter = ""
		for (const c of chars) {
			if (word[0] ==c &&  word.length > 1) {
			letter = word[1]
			break
			} else {
				letter = word[0]
			}
		}
		return letter
	}
	_parseVerse(verse) {
		// array of verses
		let parsedVerse = ""
		let words = verse.split(" ")
		for (const w of words) {
			let letter = this._getLetter(w)
			parsedVerse += letter

		}
		return parsedVerse
	}
	parse() {
		for (const verse of this.text) {
			let parsed = this._parseVerse(verse["text"])
			verse["parsed"] = parsed
		}
		return this.text
	}
}


