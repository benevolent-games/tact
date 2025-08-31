
import {MapG, obMap} from "@e280/stz"
import {tmax} from "../utils/tmax.js"
import {lensingLogic} from "../utils/lensing-logic.js"
import {defaultifyLensSettings, defaultLensState} from "../utils/lens-defaults.js"
import {ActionSnapshot, Bindings, Bracket, Context, Lens, LensState, Spoon} from "../types.js"

export class Resolver<B extends Bindings> {
	actions: ActionSnapshot<B>
	#now = 0
	#samples = new Map<string, number>()
	#lenses = new MapG<Lens, LensState>()
	#refreshers: (() => void)[] = []

	constructor(
			public bindings: B,
			private modes: Set<keyof B>,
		) {
		this.modes = modes as Set<keyof Bindings>
		this.actions = obMap(bindings as Bindings, this.#resolveBracket) as ActionSnapshot<B>
	}

	poll(context: Context) {
		this.#now = context.now
		this.#samples = context.samples
		this.#refreshers.forEach(fn => fn())
	}

	#resolveBracket = (bracket: Bracket, mode: keyof Bindings) => {
		const actions = obMap(bracket, (_, actionKey) => {
			this.#refreshers.push(() => {
				actions[actionKey] = this.#resolveFork(mode, actionKey)
			})
			return this.#resolveFork(mode, actionKey)
		})
		return actions
	}

	#resolveFork = (mode: keyof Bindings, actionKey: keyof Bindings[keyof Bindings]) => {
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
		return lensingLogic(value, settings, state, this.#now)
	}
}

