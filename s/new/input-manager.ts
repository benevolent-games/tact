
import {MapG} from "@e280/stz"
import {Action} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Bindings} from "./parts/types.js"
import {CauseRepo} from "./parts/cause-repo.js"
import {InputBracket} from "./input-bracket.js"

/** orchestrate multiple input brackets via modes */
export class InputManager<B extends Bindings> {
	modes = new Set<keyof B>()
	devices = new Set<Device>()
	actions: {[Mode in keyof B]: {[K in keyof B[Mode]]: Action}}

	#causeRepo = new CauseRepo()
	#brackets = new MapG<keyof B, InputBracket<any>>()

	constructor(bindings: B) {
		this.actions = this.#build_actions(bindings)
	}

	poll(now: number) {
		this.#causeRepo.resetAllToZero()

		// poll brackets for active modes
		for (const mode of this.modes) {
			const bracket = this.#brackets.require(mode)
			bracket.poll(now)
		}
	}

	#build_actions(bindings: B) {
		const actions = {} as any
		for (const [mode, binds] of Object.entries(bindings)) {
			const bracket = new InputBracket(binds, this.devices, this.#causeRepo)
			this.#brackets.set(mode, bracket)
			actions[mode] = bracket.actions
		}
		return actions
	}
}

