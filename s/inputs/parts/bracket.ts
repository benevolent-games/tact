
import {Lens} from "./lens.js"
import {Repo} from "./repo.js"
import {Fork} from "../units/fork.js"
import {Spoon} from "../units/spoon.js"
import {_poll, Action} from "./action.js"
import {LensBind, BracketBinds, SpoonBind} from "../types.js"

/** inputs for a single mode */
export class Bracket<B extends BracketBinds> {
	actions: {[K in keyof B]: Action}
	#actions: Action[] = []

	constructor(binds: B, private repo = new Repo()) {
		this.actions = this.#buildActions(binds)
	}

	poll(now: number) {
		for (const action of this.#actions)
			action[_poll](now)
	}

	#buildActions(binds: B) {
		const actions = {} as {[K in keyof B]: Action}
		for (const [name, spoonBinds] of Object.entries(binds)) {
			const spoons = spoonBinds.map(bind => this.#makeSpoon(bind))
			const fork = new Fork(spoons)
			const action = new Action(fork)
			this.#actions.push(action)
			actions[name as keyof B] = action
		}
		return actions
	}

	#makeSpoon(bind: SpoonBind) {
		const makeLens = ({code, settings}: LensBind) => {
			const cause = this.repo.guarantee(code)
			return new Lens(cause, settings)
		}
		const lenses = bind.lenses.map(makeLens)
		const required = (bind.required ?? []).map(makeLens)
		const forbidden = (bind.forbidden ?? []).map(makeLens)
		return new Spoon(lenses, required, forbidden)
	}
}

