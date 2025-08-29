
import {MapG} from "@e280/stz"
import {Repo} from "./parts/repo.js"
import {Action} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Bindings} from "./types.js"
import {InputBracket} from "./input-bracket.js"

/** orchestrate multiple input brackets via modes */
export class InputManager<B extends Bindings> {
	modes = new Set<keyof B>()
	devices = new Set<Device>()
	actions: {[Mode in keyof B]: {[K in keyof B[Mode]]: Action}}

	#repo = new Repo()
	#brackets = new MapG<keyof B, InputBracket<any>>()

	constructor(bindings: B) {
		this.actions = this.#buildActions(bindings)
	}

	poll(now: number) {
		this.#repo.sampleDevices(this.devices)

		// poll active mode brackets
		for (const mode of this.modes)
			this.#brackets.require(mode).poll(now)
	}

	#buildActions(bindings: B) {
		const actions = {} as any
		for (const [mode, binds] of Object.entries(bindings)) {
			const bracket = new InputBracket(binds, this.#repo)
			this.#brackets.set(mode, bracket)
			actions[mode] = bracket.actions
		}
		return actions
	}
}

