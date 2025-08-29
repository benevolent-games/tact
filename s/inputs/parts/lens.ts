
import {Cause} from "../units/cause.js"
import {LensSettings} from "../types.js"
import {isPressed} from "../utils/is-pressed.js"
import {applyDeadzone} from "../utils/apply-deadzone.js"

export const defaultHoldTime = 250
export const defaultDeadzone = 0.2

export class Lens {
	settings: LensSettings
	#lastValue = 0
	#holdStart = 0

	constructor(public cause: Cause, settings: Partial<LensSettings> = {}) {
		this.settings = {
			scale: 1,
			invert: false,
			deadzone: defaultDeadzone,
			timing: {style: "direct"},
			...settings,
		}
	}

	poll(now: number) {
		const {settings} = this
		let {value} = this.cause
		value = applyDeadzone(value, settings.deadzone)
		if (settings.invert) value = value * -1
		value *= settings.scale
		return this.#timingConsiderations(value, now)
	}

	#timingConsiderations(value: number, now: number) {
		const {timing} = this.settings

		const holdTime = (
			timing.style === "direct"
				? undefined
				: timing.holdTime
		) ?? defaultHoldTime

		const isFreshlyPressed = !isPressed(this.#lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(this.#lastValue) && !isPressed(value)
		const isHolding = (now - this.#holdStart) >= holdTime

		if (isFreshlyPressed)
			this.#holdStart = now

		this.#lastValue = value

		switch (timing.style) {
			case "direct":
				return value

			case "tap":
				return (isFreshlyReleased && !isHolding)
					? 1
					: 0

			case "hold":
				return (isPressed(value) && isHolding)
					? value
					: 0
		}
	}
}

