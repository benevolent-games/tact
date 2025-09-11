
import {Hub} from "../../../core/hub/hub.js"
import {SchtickController} from "../../../nubs/schtick/controller.js"
import {GroupController} from "../../../core/controllers/infra/group.js"
import {PointerController} from "../../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../../core/controllers/standard/keyboard.js"

export class CompositeDevice extends GroupController {
	constructor() {
		super(
			new KeyboardController(),
			new PointerController(),
		)
	}
}

export class VirtualDevice extends SchtickController {
	constructor(private hub: Hub<any>) {
		super()
	}

	shimmyNext = () => this.hub.shimmy(this, 1)
	shimmyPrevious = () => this.hub.shimmy(this, -1)
}

