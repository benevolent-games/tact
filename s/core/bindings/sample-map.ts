
import {MapG} from "@e280/stz"
import {Sample} from "../devices/types.js"

export class SampleMap extends MapG<string, number> {
	constructor(samples?: Iterable<Sample>) {
		super()
		if (samples) {
			for (const [code, value] of samples)
				this.set(code, value)
		}
	}

	zero() {
		for (const code of this.keys()) this.set(code, 0)
		return this
	}

	mergeSample([code, value]: Sample) {
		const previous = this.get(code) ?? 0
		if (value > previous) this.set(code, value)
		return this
	}
}

