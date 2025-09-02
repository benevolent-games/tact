
import {Scalar} from "@benev/math"
import {obMap, pipe, WeakMapG} from "@e280/stz"

import {Action} from "../action.js"
import {Actions} from "../types.js"
import {LensState} from "./types.js"
import {zeroedBracket} from "./zeroed.js"
import {isPressed} from "../utils/is-pressed.js"
import {tmax} from "../../../utils/quick-math.js"
import {SampleMap} from "../../controllers/types.js"
import {defaultHoldTime, defaultLensState} from "./defaults.js"
import {Bindings, Bracket, Fork, Lens, Spoon} from "../../bindings/types.js"

export function resolve<B extends Bindings>(context: {
		now: number
		bindings: Bindings
		modes: Set<keyof Bindings>
		samples: SampleMap
		lensStates: WeakMapG<Lens, LensState>
		previousActions: Actions<B>
	}): Actions<B> {

	return obMap(context.bindings, resolveBracket(context)) as Actions<B>
}

export const resolveBracket = (
	(context: {
		now: number
		modes: Set<keyof Bindings>
		samples: SampleMap
		lensStates: WeakMapG<Lens, LensState>
		previousActions: Actions<Bindings>
	}) =>
	(bracket: Bracket, mode: keyof Bindings) => {

	return context.modes.has(mode)
		? obMap(bracket, resolveFork({
			...context,
			previousActionsBracket: context.previousActions[mode],
		}))
		: zeroedBracket(bracket)
})

const resolveFork = (
	(context: {
		now: number
		samples: SampleMap
		lensStates: WeakMapG<Lens, LensState>
		previousActionsBracket: Record<keyof Bracket, Action>
	}) =>
	(fork: Fork, actionName: keyof Bracket) => {

	const value = tmax(fork.map(resolveSpoon(context)))
	const previousAction = context.previousActionsBracket[actionName]
	return new Action(value, previousAction.value)
})

const resolveSpoon = (
	(context: {
		now: number,
		samples: SampleMap,
		lensStates: WeakMapG<Lens, LensState>,
	}) =>
	(spoon: Spoon) => {

	const resolver = resolveLens(context)
	const {lenses, required = [], forbidden = []} = spoon

	const satisfiedRequirements = () => {
		if (required.length === 0) return true
		const requiredValues = required.map(resolver)
		return !requiredValues.some(value => value <= 0)
	}

	const satisfiedForbiddens = () => {
		if (forbidden.length === 0) return true
		const forbiddenValues = forbidden.map(resolver)
		return !forbiddenValues.some(value => value > 0)
	}

	const combineValues = () => {
		const values = lenses.map(resolver)
		return tmax(values)
	}

	return (satisfiedRequirements() && satisfiedForbiddens())
		? combineValues()
		: 0
})

const resolveLens = (
	(context: {
		now: number,
		samples: SampleMap,
		lensStates: WeakMapG<Lens, LensState>,
	}) =>
	(lens: Lens) => {

	const state = context.lensStates.guarantee(lens, () => defaultLensState(lens))
	const v = context.samples.get(lens.code) ?? 0
	return lensingAlgo(context.now, state, v)
})

const lensingAlgo = (
		now: number,
		state: LensState,
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

