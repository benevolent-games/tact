
import {MapG} from "@e280/stz"
import {Bindings} from "./types.js"
import {Repo} from "./parts/repo.js"
import {Action} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Bracket} from "./parts/bracket.js"

/** orchestrate multiple input brackets via modes */
export class Inputs<B extends Bindings> {
	modes = new Set<keyof B>()
	devices = new Set<Device>()
	actions: {[Mode in keyof B]: {[K in keyof B[Mode]]: Action}}

	#repo = new Repo()
	#brackets = new MapG<keyof B, Bracket<any>>()

	constructor(bindings: B) {
		this.actions = this.#buildActions(bindings)
	}

	attach(...devices: Device[]) {
		for (const device of devices)
			this.devices.add(device)
		return this
	}

	detach(...devices: Device[]) {
		for (const device of devices)
			this.devices.delete(device)
		return this
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
			const bracket = new Bracket(binds, this.#repo)
			this.#brackets.set(mode, bracket)
			actions[mode] = bracket.actions
		}
		return actions
	}
}

