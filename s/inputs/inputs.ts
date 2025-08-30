
import {MapG} from "@e280/stz"
import {Cause} from "./units/cause.js"
import {Action} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Bracket} from "./parts/bracket.js"
import {Bindings, Sample} from "./types.js"
import {normalizeSamples} from "./utils/normalize-samples.js"

/** orchestrate multiple input brackets via modes */
export class Inputs<B extends Bindings> {
	modes = new Set<keyof B>()
	devices = new Set<Device>()
	actions: {[Mode in keyof B]: {[K in keyof B[Mode]]: Action}}

	#causes = new MapG<string, Cause>()
	#brackets = new MapG<keyof B, Bracket<any>>()

	constructor(bindings: B) {
		this.actions = this.#buildActions(bindings)
	}

	poll(now: number) {
		this.#resetCausesToZero()
		const samples = this.#takeAllDeviceSamples()
		this.#assignSamplesToCauses(samples)
		this.#pollBracketsForActiveModes(now)
	}

	attachDevices(...devices: Device[]) {
		for (const device of devices)
			this.devices.add(device)
		return this
	}

	detachDevices(...devices: Device[]) {
		for (const device of devices)
			this.devices.delete(device)
		return this
	}

	enableModes(...modes: (keyof B)[]) {
		for (const mode of modes)
			this.modes.add(mode)
		return this
	}

	disableModes(...modes: (keyof B)[]) {
		for (const mode of modes)
			this.modes.add(mode)
		return this
	}

	#obtainCause = (code: string) => {
		return this.#causes.guarantee(code, () => new Cause())
	}

	#resetCausesToZero() {
		for (const cause of this.#causes.values())
			cause.value = 0
	}

	#takeAllDeviceSamples() {
		return normalizeSamples(
			[...this.devices]
				.flatMap(device => device.takeSamples())
		)
	}

	#assignSamplesToCauses(samples: Sample[]) {
		for (const [code, value] of samples) {
			const cause = this.#causes.get(code)
			if (cause) cause.value = value
		}
	}

	#pollBracketsForActiveModes(now: number) {
		for (const mode of this.modes)
			this.#brackets.require(mode).poll(now)
	}

	#buildActions(bindings: B) {
		const actions = {} as any
		for (const [mode, binds] of Object.entries(bindings)) {
			const bracket = new Bracket(binds, this.#obtainCause)
			this.#brackets.set(mode, bracket)
			actions[mode] = bracket.actions
		}
		return actions
	}
}

