
import {Spoon} from "./spoon.js"
import {tmax} from "../utils/tmax.js"

export class Fork {
	constructor(public spoons: Spoon[]) {}

	poll(now: number) {
		const values = this.spoons.map(c => c.poll(now))
		return tmax(values)
	}
}

