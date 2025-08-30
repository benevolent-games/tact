
import {sub} from "@e280/stz"
import {Sample} from "../types.js"
import {SetG} from "../../utils/set-g.js"

export abstract class Device {
	abstract takeSamples(): Sample[]
}

export class DeviceGroup extends Device {
	devices = new SetG<Device>()

	constructor(devices: Device[]) {
		super()
		this.devices.adds(...devices)
	}

	takeSamples() {
		return [...this.devices].flatMap(device => device.takeSamples())
	}
}

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

