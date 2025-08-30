
import {Sample} from "../types.js"

export abstract class Device {
	abstract takeSamples(): Sample[]
}

export class DeviceGroup extends Device {
	constructor(public devices: Device[]) {
		super()
	}

	takeSamples() {
		return this.devices.flatMap(device => device.takeSamples())
	}
}

export class SamplerDevice extends Device {
	#map = new Map<string, number>()

	setSample(code: string, value: number) {
		this.#map.set(code, value)
		return this
	}

	takeSamples(): Sample[] {
		const samples = [...this.#map]
		this.#map.clear()
		return samples
	}
}

