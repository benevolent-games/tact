
import {Disposable, ev, MapG} from "@e280/stz"
import {evergreen} from "./evergreen.js"

/** stable reference to a gamepad, has a getter to get the latest gamepad snapshot */
export class Pad {
	constructor(private get: () => Gamepad) {}

	get gamepad() {
		return this.get()
	}
}

/** track gamepad lifecycles as they connect or disconnect */
export class Gamepads implements Disposable {
	dispose: () => void
	#pads = new MapG<number, {pad: Pad, dispose: () => void}>()

	constructor(public on: (pad: Pad) => () => void) {
		this.dispose = ev(window, {

			gamepadconnected: ({gamepad}: GamepadEvent) => {
				const get = () => navigator.getGamepads().at(gamepad.index)
				const pad = new Pad(evergreen(gamepad, get))
				const dispose = this.on(pad)
				this.#pads.set(gamepad.index, {pad, dispose})
			},

			gamepaddisconnected: ({gamepad}: GamepadEvent) => {
				const result = this.#pads.get(gamepad.index)
				if (result) {
					this.#pads.delete(gamepad.index)
					result.dispose()
				}
			},
		})
	}
}

