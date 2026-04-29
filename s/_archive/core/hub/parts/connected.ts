
import {Port} from "../port.js"
import {MetaBindings} from "../types.js"
import {Device} from "../../devices/device.js"
import {makeMetaBindings} from "../meta-bindings.js"

export class Connected {
	metaPort: Port<MetaBindings>

	constructor(public device: Device, metaB = makeMetaBindings()) {
		this.metaPort = new Port(metaB)
		this.metaPort.devices.add(device)
	}
}

