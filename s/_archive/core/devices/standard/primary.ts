
import {VpadDevice} from "./vpad.js"
import {PointerDevice} from "./pointer.js"
import {KeyboardDevice} from "./keyboard.js"
import {GroupDevice} from "../infra/group.js"

export class PrimaryDevice extends GroupDevice {
	keyboard = new KeyboardDevice()
	pointer = new PointerDevice()
	vpad = new VpadDevice()

	constructor() {
		super()
		this.devices
			.add(this.keyboard)
			.add(this.pointer)
			.add(this.vpad)
	}
}

