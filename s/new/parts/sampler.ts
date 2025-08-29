
import {Sample} from "./types.js"

export class Sampler {
	#map = new Map<string, number>()

	set(code: string, value: number) {
		return this.#map.set(code, value)
	}

	samples(): Sample[] {
		const samples = [...this.#map]
		this.#map.clear()
		return samples
	}
}

