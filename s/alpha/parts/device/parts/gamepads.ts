
import {ev, GMap} from "@e280/stz"
import {evergreen} from "../../utils/evergreen.js"

/** stable reference to a gamepad, has a getter to get the latest gamepad snapshot */
export class Pad {
	constructor(private get: () => Gamepad) {}

	get gamepad() {
		return this.get()
	}
}

/** track gamepad lifecycles as they connect or disconnect */
export function onGamepad(on: (pad: Pad) => () => void) {
	const pads = new GMap<number, {pad: Pad, dispose: () => void}>()

	return ev(window, {
		gamepadconnected: ({gamepad}: GamepadEvent) => {
			const get = () => navigator.getGamepads().at(gamepad.index)
			const pad = new Pad(evergreen(gamepad, get))
			const dispose = on(pad)
			pads.set(gamepad.index, {pad, dispose})
		},

		gamepaddisconnected: ({gamepad}: GamepadEvent) => {
			const result = pads.get(gamepad.index)
			if (result) {
				pads.delete(gamepad.index)
				result.dispose()
			}
		},
	})
}

