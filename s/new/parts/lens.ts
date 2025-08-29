
import {Cause} from "./cause.js"
import {LensSettings} from "./types.js"
import {applyDeadzone, isPressed} from "./utils.js"

export class Lens {
	settings: LensSettings
	#lastValue = 0
	#holdStartTime = 0

	constructor(public cause: Cause, settings: Partial<LensSettings> = {}) {
		this.settings = {
			scale: 1,
			invert: false,
			deadzone: 0.1,
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

		const threshold = (
			timing.style === "direct"
				? undefined
				: timing.time
		) ?? 50

		const isFreshlyPressed = !isPressed(this.#lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(this.#lastValue) && !isPressed(value)
		const isHolding = (now - this.#holdStartTime) >= threshold

		if (isFreshlyPressed)
			this.#holdStartTime = now

		this.#lastValue = value

		switch (timing.style) {
			case "direct":
				return value

			case "tap":
				return (isFreshlyReleased && !isHolding)
					? 1
					: 0

			case "hold":
				return (isFreshlyPressed && isHolding)
					? value
					: 0
		}
	}
}

