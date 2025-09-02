
import {pipe} from "@e280/stz"
import {Scalar} from "@benev/math"

import {CodeState} from "../types.js"
import {defaultHoldTime} from "./defaults.js"
import {isPressed} from "../../port/utils/is-pressed.js"

export const lensAlgo = (
		now: number,
		state: CodeState,
		v: number,
	) => pipe(v).line(

	function deadzone(value) {
		if (value < state.settings.deadzone)
			return 0

		if (value > 1)
			return value

		return Scalar.remap(
			value,
			state.settings.deadzone, 1,
			0, 1,
		)
	},

	function inversion(value) {
		return state.settings.invert
			? value * -1
			: value
	},

	function scaling(value) {
		return state.settings.scale * value
	},

	function timing(value) {
		const {settings} = state

		const holdTime = (
			settings.timing[0] === "direct"
				? undefined
				: settings.timing[1]
		) ?? defaultHoldTime

		const isFreshlyPressed = !isPressed(state.lastValue) && isPressed(value)
		const isFreshlyReleased = isPressed(state.lastValue) && !isPressed(value)
		const isHolding = (now - state.holdStart) >= holdTime

		if (isFreshlyPressed)
			state.holdStart = now

		state.lastValue = value

		switch (settings.timing[0]) {
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

