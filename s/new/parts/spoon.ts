
import {Lens} from "./lens.js"
import {tmax} from "./utils.js"

export class Spoon {
	constructor(
		public lenses: Lens[],
		public required: Lens[],
		public forbidden: Lens[],
	) {}

	poll(now: number) {
		return (this.#satisfiedRequirements(now) && this.#satisfiedForbiddens(now))
			? this.#combineValues(now)
			: 0
	}

	#satisfiedRequirements(now: number) {
		if (this.required.length === 0) return true
		const requiredValues = this.required.map(lens => lens.poll(now))
		return !requiredValues.some(value => value <= 0)
	}

	#satisfiedForbiddens(now: number) {
		if (this.forbidden.length === 0) return true
		const forbiddenValues = this.forbidden.map(lens => lens.poll(now))
		return !forbiddenValues.some(value => value > 0)
	}

	#combineValues(now: number) {
		const values = this.lenses.map(lens => lens.poll(now))
		return tmax(values)
	}
}

