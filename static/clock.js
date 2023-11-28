export class Formater {
	constructor() {
		this.time = 60000;
	}
	_createTime() {
		let secs = this.time / 1000;
		let [hours,left] = this._divmod(secs, 3600);
		let [minutes, secsLeft] = this._divmod(left, 60)
		let [seconds,millisLeft] = this._divmod(secsLeft, 1)
		let [milli, _] = this._divmod(millisLeft, 1)
		return [hours,minutes,seconds,Math.floor(millisLeft*1000)]
	}
	formatTime(time) {
		this.time = time;
		let [hours,minutes,seconds,milli] = this._createTime()
		hours = this._fixFormat(hours)
		//minutes = this._fixFormat(minutes)
		seconds = this._fixFormat(seconds)
		if (this.time<(3600*1000)) {
			hours=""
		} else {
			hours=`${hours}:`
		}

		if (this.time>1000) {
		milli = ""	
		} else {
			milli = `:${milli}`
		} 
/*
		if (this.time<60000) {
			minutes=""
		} else {
			minutes=`${minutes}:`
		}
		*/
		let timeFormatted = `${hours}${minutes}:${seconds}${milli}`
		return timeFormatted
	}
	_fixFormat(time) {
		if (`${time}`.length===2) {
			return time
		} else {
			return `0${time}`
		}
	}
	_divmod(n, divisor) {
		let quotient = Math.floor(n / divisor);
		let reminder = n % divisor;
		return [quotient,reminder]
	}
}
