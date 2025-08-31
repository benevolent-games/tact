
import {WeakMapG} from "@e280/stz"
import {tmax} from "../utils/tmax.js"
import {lensing_algorithm} from "./routines/lensing_algorithm.js"
import {defaultifyLensSettings, defaultLensState} from "./defaults.js"
import {Actions, Bindings, Context, Lens, LensState, Spoon} from "../types.js"
import {build_updatable_actions_structure} from "./routines/build_updatable_actions_structure.js"

export class Resolver<B extends Bindings> {
	actions: Actions<B>
	#now = 0
	#samples = new Map<string, number>()
	#lenses = new WeakMapG<Lens, LensState>()
	#updateValues: () => void

	constructor(
			public bindings: B,
			private modes: Set<keyof B>,
		) {
		this.modes = modes as Set<keyof Bindings>
		const structure = build_updatable_actions_structure(
			bindings,
			this.#resolveActionValue,
		)
		this.actions = structure.actions
		this.#updateValues = structure.updateValues
	}

	poll(context: Context) {
		this.#now = context.now
		this.#samples = context.samples
		this.#updateValues()
	}

	#resolveActionValue = (mode: keyof B, actionKey: keyof B[keyof B]) => {
		const fork = this.bindings[mode][actionKey]
		const isModeActive = this.modes.has(mode)
		if (!isModeActive) return 0
		return tmax(fork.map(this.#resolveSpoon))
	}

	#resolveSpoon = ({lenses, required = [], forbidden = []}: Spoon) => {
		const satisfiedRequirements = () => {
			if (required.length === 0) return true
			const requiredValues = required.map(this.#resolveLens)
			return !requiredValues.some(value => value <= 0)
		}

		const satisfiedForbiddens = () => {
			if (forbidden.length === 0) return true
			const forbiddenValues = forbidden.map(this.#resolveLens)
			return !forbiddenValues.some(value => value > 0)
		}

		const combineValues = () => {
			const values = lenses.map(this.#resolveLens)
			return tmax(values)
		}

		return (satisfiedRequirements() && satisfiedForbiddens())
			? combineValues()
			: 0
	}

	#resolveLens = (lens: Lens) => {
		const {code} = lens
		const value = this.#samples.get(code) ?? 0
		const state = this.#lenses.guarantee(lens, defaultLensState)
		const settings = defaultifyLensSettings(lens.settings)
		return lensing_algorithm(value, settings, state, this.#now)
	}
}

