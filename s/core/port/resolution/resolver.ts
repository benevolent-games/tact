
import {obMap, pub, WeakMapG} from "@e280/stz"

import {Actions} from "../types.js"
import {Action} from "../action.js"
import {LensState} from "./types.js"
import {lensAlgo} from "./lens-algo.js"
import {defaultLensState} from "./defaults.js"
import {tmax} from "../../../utils/quick-math.js"
import {SampleMap} from "../../controllers/types.js"
import {Bindings, Fork, Lens, Spoon} from "../../bindings/types.js"

export class Resolver<B extends Bindings> {
	#actions: Actions<B>
	#modes: Set<keyof B>

	#now = 0
	#samples: SampleMap = new Map()
	#lensStates = new WeakMapG<Lens, LensState>()
	#update = pub()

	constructor(public readonly bindings: B, modes: Set<keyof B>) {
		this.#modes = modes
		this.#actions = obMap(bindings, (bracket, mode) => obMap(bracket, fork => {
			const action = new Action()
			this.#update.subscribe(() => {
				Action.update(action, this.#resolveFork(fork, mode))
			})
			return action
		})) as Actions<B>
	}

	poll(now: number, samples: SampleMap) {
		this.#now = now
		this.#samples = samples
		this.#update()
		return this.#actions
	}

	#resolveFork = (fork: Fork, mode: keyof B) => {
		return (this.#modes.has(mode))
			? tmax(fork.map(this.#resolveSpoon))
			: 0
	}

	#resolveSpoon = (spoon: Spoon) => {
		const {lenses, required = [], forbidden = []} = spoon

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
		const state = this.#lensStates.guarantee(lens, () => defaultLensState(lens))
		const v = this.#samples.get(lens.code) ?? 0
		return lensAlgo(this.#now, state, v)
	}
}

