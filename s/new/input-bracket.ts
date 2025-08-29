
import {MapG} from "@e280/stz"
import {Lens} from "./parts/lens.js"
import {Fork} from "./parts/fork.js"
import {tmax} from "./parts/utils.js"
import {Spoon} from "./parts/spoon.js"
import {Action} from "./parts/action.js"
import {Device} from "./parts/device.js"
import {ModeBinds} from "./parts/types.js"
import {CauseRepo} from "./parts/cause-repo.js"

/** inputs for a single mode */
export class InputBracket<B extends ModeBinds> {
	actions: {[K in keyof B]: Action}
	#actions: Action[] = []

	constructor(
			binds: B,
			public devices = new Set<Device>(),
			public causeRepo = new CauseRepo(),
		) {
		this.actions = this.#build_actions(binds)
	}

	poll(now: number) {
		this.#update_causes_from_device_samples()
		this.#update_actions(now)
	}

	#build_actions(binds: B) {
		const actions = {} as {[K in keyof B]: Action}

		for (const [name, data] of Object.entries(binds)) {
			const spoons = data.map(actionBinds => {
				const lenses = actionBinds.map(({code, settings}) => {
					const cause = this.causeRepo.guarantee(code)
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

	#update_causes_from_device_samples() {
		const aggregated = new MapG<string, number[]>()

		for (const device of this.devices) {
			for (const report of device.samples()) {
				const values = aggregated.guarantee(report.code, () => [])
				values.push(report.value)
			}
		}

		for (const [code, values] of aggregated) {
			const cause = this.causeRepo.get(code)
			if (cause) cause.value = tmax(values)
		}
	}

	#update_actions(now: number) {
		for (const action of this.#actions)
			action.poll(now)
	}
}

