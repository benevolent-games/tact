
import {Lens} from "./lens.js"
import {tmax} from "./utils.js"

export class Spoon {
	constructor(public lenses: Lens[]) {}

	poll(now: number) {
		const values = this.lenses.map(c => c.poll(now))
		const unanimous = values.every(v => v > 0)
		return unanimous
			? tmax(values)
			: 0
	}
}

