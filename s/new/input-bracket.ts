
import {Fork} from "./parts/fork.js"
import {Lens} from "./parts/lens.js"
import {Repo} from "./parts/repo.js"
import {Spoon} from "./parts/spoon.js"
import {Action} from "./parts/action.js"
import {ModeBinds} from "./parts/types.js"

/** inputs for a single mode */
export class InputBracket<B extends ModeBinds> {
	actions: {[K in keyof B]: Action}
	#actions: Action[] = []

	constructor(
			binds: B,
			public repo = new Repo(),
		) {
		this.actions = this.#build_actions(binds)
	}

	poll(now: number) {
		for (const action of this.#actions)
			action.poll(now)
	}

	#build_actions(binds: B) {
		const actions = {} as {[K in keyof B]: Action}
		for (const [name, data] of Object.entries(binds)) {
			const spoons = data.map(actionBinds => {
				const lenses = actionBinds.map(({code, settings}) => {
					const cause = this.repo.guarantee(code)
					return new Lens(cause, settings)
				})
				return new Spoon(lenses)
			})
			const fork = new Fork(spoons)
			const action = new Action(fork)
			this.#actions.push(action)
			actions[name as keyof B] = action
		}
		return actions
	}
}

