
import {SetG} from "@e280/stz"
import {Device} from "../device.js"
import {SampleMap} from "../../bindings/sample-map.js"

export class GroupDevice extends Device {
	devices = new SetG<Device>()
	#sampleMap = new SampleMap()

	constructor(...devices: Device[]) {
		super()
		this.devices.adds(...devices)
	}

	;*samples() {
		this.#sampleMap.zero()
		for (const device of this.devices) {
			for (const sample of device.samples())
				this.#sampleMap.mergeSample(sample)
		}
		yield* this.#sampleMap.entries()
	}
}

