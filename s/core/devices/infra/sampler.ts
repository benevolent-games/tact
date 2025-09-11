
import {sub} from "@e280/stz"
import {Sample} from "../types.js"
import {Device} from "../device.js"
import {SampleMap} from "../../bindings/sample-map.js"

export class SamplerDevice extends Device {
	on = sub<Sample>()
	#map = new SampleMap()

	setSample(code: string, value: number) {
		this.#map.set(code, value)
		this.on.pub(code, value)
		return this
	}

	takeSamples(): Sample[] {
		const samples = [...this.#map]
		this.#map.zero()
		return samples
	}
}

