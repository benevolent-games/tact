
import {Bindings} from "../core/types.js"
import {Controller} from "./controller.js"
import {onPad} from "../device/parts/pad.js"
import {GamepadDevice} from "../device/gamepad.js"

export function onGamepadController<B extends Bindings>(
		bindings: B,
		fn: (controller: Controller<B, GamepadDevice>) => () => void
	) {

	return onPad(pad => {
		const device = new GamepadDevice(pad)
		const controller = new Controller(bindings, device)
		return fn(controller)
	})
}

