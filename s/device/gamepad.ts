
import {Scalar} from "@benev/math"
import {Pad} from "./pad/pad.js"
import {SamplerDevice} from "./sampler.js"
import {splitAxis} from "../utils/split-axis.js"

export class GamepadDevice extends SamplerDevice {
	min = 0.2
	max = 0.9

	constructor(public pad: Pad) {
		super()
	}

	get gamepad() {
		return this.pad.gamepad
	}

	*samples() {
		this.#pollButtons(this.pad.gamepad)
		this.#pollSticks(this.pad.gamepad)
		yield* super.samples()
	}

	#pollButtons(gamepad: Gamepad) {
		let anyButtonValue = 0
		for (const [index, button] of gamepad.buttons.entries()) {
			const i = index + 1
			const value = button.value
			anyButtonValue = Math.max(anyButtonValue, value)
			this.setSample(`gamepad.button.${i}`, this.#correction(value))
		}
		this.setSample("gamepad.button.any", this.#correction(anyButtonValue))
	}

	#correction(x: number, min = this.min, max = this.max) {
		return Scalar.remap(x, min, max, 0, 1, true)
	}

	#pollSticks(gamepad: Gamepad) {
		for (const [index, axis] of gamepad.axes.entries()) {
			const i = index + 1
			this.setSample(`gamepad.axis.${i}`, this.#correction(axis, -this.max, this.max))
			const [neg, pos] = splitAxis(axis)
			this.setSample(`gamepad.axis.${i}.neg`, this.#correction(neg))
			this.setSample(`gamepad.axis.${i}.pos`, this.#correction(pos))
		}
	}
}

