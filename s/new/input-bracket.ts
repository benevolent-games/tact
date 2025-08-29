
import {Fork} from "./parts/fork.js"
import {Lens} from "./parts/lens.js"
import {Repo} from "./parts/repo.js"
import {Spoon} from "./parts/spoon.js"
import {Action} from "./parts/action.js"
import {LensBind, ModeBinds, SpoonBind} from "./parts/types.js"

/** inputs for a single mode */
export class InputBracket<B extends ModeBinds> {
	actions: {[K in keyof B]: Action}
	#actions: Action[] = []

	constructor(
			binds: B,
			public repo = new Repo(),
		) {
		this.actions = this.#buildActions(binds)
	}

	poll(now: number) {
		for (const action of this.#actions)
			action.poll(now)
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

