
import {MapG} from "@e280/stz"
import {Device} from "./device.js"
import {tmax} from "../utils/tmax.js"
import {Cause} from "../units/cause.js"

export class Repo {
	#causes = new MapG<string, Cause>()

	guarantee(code: string) {
		return this.#causes.guarantee(code, () => new Cause())
	}

	sampleDevices(devices: Set<Device>) {
		this.#resetCausesToZero()
		const aggregated = this.#aggregateDeviceSamples(devices)
		this.#assignAggregatedValues(aggregated)
	}

	#resetCausesToZero() {
		for (const cause of this.#causes.values())
			cause.value = 0
	}

	#aggregateDeviceSamples(devices: Set<Device>) {
		const aggregated = new MapG<string, number[]>()
		for (const device of devices) {
			for (const [code, value] of device.samples()) {
				const values = aggregated.guarantee(code, () => [])
				values.push(value)
			}
		}
		return aggregated
	}

	#assignAggregatedValues(aggregated: MapG<string, number[]>) {
		for (const [code, values] of aggregated) {
			const cause = this.#causes.get(code)
			if (cause) cause.value = tmax(values)
		}
	}
}

