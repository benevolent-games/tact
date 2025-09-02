
import {SetG, WeakMapG} from "@e280/stz"
import {Actions} from "./types.js"
import {LensState} from "./resolution/types.js"
import {resolve} from "./resolution/resolve.js"
import {SampleMap} from "../controllers/types.js"
import {Bindings, Lens} from "../bindings/types.js"
import {zeroedActions} from "./resolution/zeroed.js"
import {Controller} from "../controllers/controller.js"
import {wipe_samples_map} from "./parts/routines/wipe_samples_map.js"
import {aggregate_samples_into_map} from "./parts/routines/aggregate_samples_into_map.js"

export class Port<B extends Bindings> {
	readonly modes = new SetG<keyof B>()
	readonly controllers = new SetG<Controller>()

	#previousActions: Actions<B>
	#samples: SampleMap = new Map()
	#lensStates = new WeakMapG<Lens, LensState>()

	constructor(public bindings: B) {
		this.#previousActions = zeroedActions(bindings)
	}

	poll(now: number = Date.now()) {
		wipe_samples_map(this.#samples)
		aggregate_samples_into_map(this.controllers, this.#samples)
		return resolve({
			now,
			bindings: this.bindings,
			lensStates: this.#lensStates,
			modes: this.modes as Set<any>,
			previousActions: this.#previousActions,
			samples: this.#samples,
		})
	}
}

