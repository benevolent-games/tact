
import {MapG} from "@e280/stz"
import {Sample} from "../controllers/types.js"

export class SampleMap extends MapG<string, number> {
	static combine(...maps: SampleMap[]) {
		const samples = new this()
		for (const map of maps) {
			for (const [code, value] of map) {
				const previous = samples.get(code) ?? 0
				if (value > previous)
					samples.set(code, value)
			}
		}
		return samples
	}

	constructor(samples?: Sample[]) {
		super()
		if (samples) this.ingest(samples)
	}

	zero() {
		for (const code of this.keys())
			this.set(code, 0)
		return this
	}

	ingest(samples: Sample[]) {
		for (const [code, value] of samples) {
			const previous = this.get(code) ?? 0
			if (value > previous)
				this.set(code, value)
		}
	}
}

