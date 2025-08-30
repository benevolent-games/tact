
import {MapG} from "@e280/stz"
import {SetG} from "../utils/set-g.js"
import {Cause} from "./units/cause.js"
import {_poll} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {Actions, Bindings, Sample} from "./types.js"
import {normalizeSamples} from "./utils/normalize-samples.js"
import {makeInputsActions} from "./utils/make-actions-object.js"

/** user input manager with customizable keybindings */
export class Inputs<B extends Bindings> {
	modes = new SetG<keyof B>()
	devices = new SetG<Device>()
	readonly actions: Actions<B>
	#causes = new MapG<string, Cause>()

	constructor(bindings: B) {
		this.actions = makeInputsActions(bindings, this.#causes)
	}

	poll(now: number) {
		this.#reset_causes_to_zero()
		const samples = this.#take_all_samples_from_devices()
		this.#assign_sample_values_to_causes(samples)
		this.#poll_active_mode_actions(now)
	}

	addDevices(...devices: Device[]) {
		for (const device of devices)
			this.devices.add(device)
		return this
	}

	addModes(...modes: (keyof B)[]) {
		for (const mode of modes)
			this.modes.add(mode)
		return this
	}

	#reset_causes_to_zero() {
		for (const cause of this.#causes.values())
			cause.value = 0
	}

	#take_all_samples_from_devices() {
		return normalizeSamples(
			[...this.devices]
				.flatMap(device => device.takeSamples())
		)
	}

	#assign_sample_values_to_causes(samples: Sample[]) {
		for (const [code, value] of samples) {
			const cause = this.#causes.get(code)
			if (cause) cause.value = value
		}
	}

	#poll_active_mode_actions(now: number) {
		for (const mode of this.modes) {
			for (const action of Object.values(this.actions[mode])) {
				action[_poll](now)
			}
		}
	}
}

