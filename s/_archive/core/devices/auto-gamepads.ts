
import {gamepads} from "../../utils/gamepads.js"
import {GamepadDevice} from "./standard/gamepad.js"

export function autoGamepads(fn: (device: GamepadDevice) => () => void) {
	return gamepads(pad => fn(new GamepadDevice(pad)))
}

