
import {MapG} from "@e280/stz"
import {Sample} from "../devices/types.js"

export class SampleMap extends MapG<string, number> {
	static merge(...maps: SampleMap[]) {
		const samples = new this()
		for (const map of maps) {
			for (const sample of map)
				samples.mergeSample(sample)
		}
		return samples
	}

	constructor(samples?: Iterable<Sample>) {
		super()
		if (samples) this.setSamples(samples)
	}

	zero() {
		for (const code of this.keys()) this.set(code, 0)
		return this
	}

	setSamples(samples: Iterable<Sample>) {
		for (const [code, value] of samples)
			this.set(code, value)
	}

	mergeSample([code, value]: Sample) {
		const previous = this.get(code) ?? 0
		if (value > previous) this.set(code, value)
		return this
	}

	mergeSamples(samples: Iterable<Sample>) {
		for (const sample of samples) this.mergeSample(sample)
		return this
	}

	mergeMaps(...maps: SampleMap[]) {
		for (const map of maps) {
			for (const sample of map)
				this.mergeSample(sample)
		}
		return this
	}
}

