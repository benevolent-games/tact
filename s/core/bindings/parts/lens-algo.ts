
import {pipe} from "@e280/stz"
import {Scalar} from "@benev/math"
import {CodeState} from "../types.js"
import {isPressed} from "./is-pressed.js"
import {defaultHoldTime} from "./defaults.js"

export const lensAlgo = (
		now: number,
		state: CodeState,
		v: number,
	) => pipe(v).line(

	function clippings(value) {
		const {settings} = state
		if (settings.range) {
			const [bottom, top] = settings.range
			value = Scalar.isBetween(value, bottom, top)
				? Scalar.remap(
					value,
					bottom, top,
					0, 1,
					true,
				)
				: 0
		}
		if (settings.bottom) value = Math.max(settings.bottom, value)
		if (settings.top) value = Math.min(settings.top, value)
		return value
	},

	function inversion(value) {
		return state.settings.invert
			? 1 - value
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

