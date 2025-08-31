
import {SetG} from "@e280/stz"
import {Device} from "./device.js"

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

