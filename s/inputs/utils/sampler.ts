
import {Sample} from "../types.js"

export class Sampler {
	#map = new Map<string, number>()

	set(code: string, value: number) {
		this.#map.set(code, value)
		return this
	}

	samples(): Sample[] {
		const samples = [...this.#map]
		this.#map.clear()
		return samples
	}
}

