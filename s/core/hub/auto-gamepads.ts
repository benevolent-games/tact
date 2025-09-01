
import {gamepads} from "../../utils/gamepads.js"
import {GamepadController} from "../controllers/standard/gamepad.js"

export function autoGamepads(fn: (controller: GamepadController) => () => void) {
	return gamepads(pad => fn(new GamepadController(pad)))
}

