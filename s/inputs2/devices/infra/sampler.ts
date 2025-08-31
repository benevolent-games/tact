
import {sub} from "@e280/stz"
import {Device} from "./device.js"
import {Sample} from "../../types.js"

export class SamplerDevice extends Device {
	on = sub<Sample>()
	#map = new Map<string, number>()

	setSample(code: string, value: number) {
		this.#map.set(code, value)
		this.on.pub(code, value)
		return this
	}

	takeSamples(): Sample[] {
		const samples = [...this.#map]
		this.#map.clear()
		return samples
	}
}

