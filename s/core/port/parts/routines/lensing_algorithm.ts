
import {pipe} from "@e280/stz"
import {Scalar} from "@benev/math"
import {defaultHoldTime} from "../defaults.js"
import {isPressed} from "../../utils/is-pressed.js"
import {LensSettings, LensState} from "../../../bindings/types.js"

export const lensing_algorithm = (
		v: number,
		settings: LensSettings,
		state: LensState,
		now: number,
	) => pipe(v).line(

	function deadzone(value) {
		if (value < settings.deadzone)
			return 0

		if (value > 1)
			return value

		return Scalar.remap(
			value,
			settings.deadzone, 1,
			0, 1,
		)
	},

	function inversion(value) {
		return settings.invert
			? value * -1
			: value
	},

	function scaling(value) {
		return settings.scale * value
	},

	function timing(value) {
		const holdTime = (
			settings.timing.style === "direct"
				? undefined
				: settings.timing.holdTime
		) ?? defaultHoldTime

		const isFreshlyPressed = !isPressed(state.lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(state.lastValue) && !isPressed(value)
		const isHolding = (now - state.holdStart) >= holdTime

		if (isFreshlyPressed)
			state.holdStart = now

		state.lastValue = value

		switch (settings.timing.style) {
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

			default:
				throw new Error(`unknown bindings timing`)
		}
	},
)

