
import {Hex} from "@e280/stz"
import {Hub} from "../../../core/hub/hub.js"
import {SchtickController} from "../../../nubs/schtick/controller.js"
import {GroupController} from "../../../core/controllers/infra/group.js"
import {PointerController} from "../../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../../core/controllers/standard/keyboard.js"

export class Device extends GroupController {
	id = Hex.random()
}

export class KeyboardDevice extends Device {
	constructor() {
		super(
			new KeyboardController(),
			new PointerController(),
		)
	}
}

export class VirtualDevice extends Device {
	stick: SchtickController

	constructor(private hub: Hub<any>) {
		const stick = new SchtickController()
		super(stick)
		this.stick = stick
	}

	shimmyNext = () => this.hub.shimmy(this, 1)
	shimmyPrevious = () => this.hub.shimmy(this, -1)
}

