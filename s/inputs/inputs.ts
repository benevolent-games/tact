
import {MapG} from "@e280/stz"
import {Cause} from "./units/cause.js"
import {_poll} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Actions, Bindings, Sample} from "./types.js"
import {normalizeSamples} from "./utils/normalize-samples.js"
import {makeInputsActions} from "./utils/make-actions-object.js"

/** orchestrate multiple input brackets via modes */
export class Inputs<B extends Bindings> {
	modes = new Set<keyof B>()
	devices = new Set<Device>()
	actions: Actions<B>
	#causes = new MapG<string, Cause>()

	constructor(bindings: B) {
		this.actions = makeInputsActions(bindings, this.#obtainCause)
	}

	poll(now: number) {
		this.#resetCausesToZero()
		const samples = this.#takeAllDeviceSamples()
		this.#assignSamplesToCauses(samples)
		this.#pollActionsForActiveModes(now)
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

	#pollActionsForActiveModes(now: number) {
		for (const mode of this.modes) {
			for (const action of Object.values(this.actions[mode])) {
				action[_poll](now)
			}
		}
	}
}

