
import {Hub} from "../../../core/hub/hub.js"
import {StickDevice} from "../../../core/devices/standard/stick.js"

export class VirtualDevice extends StickDevice {
	constructor(private hub: Hub<any>) {
		super()
	}

	shimmyNext = () => this.hub.shimmy(this, 1)
	shimmyPrevious = () => this.hub.shimmy(this, -1)
}

