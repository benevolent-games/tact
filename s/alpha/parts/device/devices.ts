
import {Device} from "../types.js"
import {SampleMap} from "../utils/sample-map.js"

export class Devices implements Device {
	set = new Set<Device>()
	#sampleMap = new SampleMap()

	constructor(...devices: Device[]) {
		for (const device of devices)
			this.set.add(device)
	}

	*samples() {
		this.#sampleMap.zero()

		for (const device of this.set)
			for (const sample of device.samples())
				this.#sampleMap.merge(sample)

		yield* this.#sampleMap
	}
}

