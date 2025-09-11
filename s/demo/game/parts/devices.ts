
import {Hub} from "../../../core/hub/hub.js"
import {SchtickDevice} from "../../../core/devices/standard/schtick.js"
import {GroupDevice} from "../../../core/devices/infra/group.js"
import {PointerDevice} from "../../../core/devices/standard/pointer.js"
import {KeyboardDevice} from "../../../core/devices/standard/keyboard.js"

export class CompositeDevice extends GroupDevice {
	constructor() {
		super(
			new KeyboardDevice(),
			new PointerDevice(),
		)
	}
}

export class VirtualDevice extends SchtickDevice {
	constructor(private hub: Hub<any>) {
		super()
	}

	shimmyNext = () => this.hub.shimmy(this, 1)
	shimmyPrevious = () => this.hub.shimmy(this, -1)
}

