class Settings {

	get minHours() {
		return 1*localStorage.getItem('minHours')
	}

	constructor(){}

	setMinHours(value) {
		try {
		console.log("Setting min hours", value)
		if ((value*1).toFixed(0)>0) {
			localStorage.setItem('minHours',value)
		} else {
			//console.log("Error")
		}
	} catch (e) {
		console.log(e)
	}
}
}
const settings = new Settings()
