class Clock {
	constructor(time) {
		this.time = time;
		this._createTime()
	}
	_createTime() {
		let secs = this.time * 60;
		let [hours,left] = this._divmod(secs, 3600);
		let [minutes, secsLeft] = this._divmod(left, 60)
		let [seconds,millisLeft] = this._divmod(secsLeft, 1000)
		let milli = millisLeft;
		console.log(hours)
		console.log(minutes)
		console.log(seconds)
		return [hours,minutes,seconds,]
	}

	_divmod(n, divisor) {
		let quotient = Math.floor(n / divisor);
		let reminder = n % divisor;
		return [quotient,reminder]
	}
	start() {
		
	}
}

let clock = new Clock(70)

