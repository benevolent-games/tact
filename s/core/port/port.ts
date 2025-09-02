
import {SetG} from "@e280/stz"
import {Bindings} from "../bindings/types.js"
import {Resolver} from "../bindings/resolver.js"
import {SampleMap} from "../controllers/types.js"
import {Controller} from "../controllers/controller.js"
import {wipe_samples_map} from "./utils/wipe_samples_map.js"
import {aggregate_samples_into_map} from "./utils/aggregate_samples_into_map.js"

export class Port<B extends Bindings> {
	readonly modes = new SetG<keyof B>()
	readonly controllers = new SetG<Controller>()
	#resolver: Resolver<B>
	#samples: SampleMap = new Map()

	constructor(bindings: B) {
		this.#resolver = new Resolver(bindings, this.modes)
	}

	get bindings() {
		return this.#resolver.bindings
	}

	set bindings(b: B) {
		this.#resolver = new Resolver(b, this.modes)
	}

	poll(now: number = Date.now()) {
		wipe_samples_map(this.#samples)
		aggregate_samples_into_map(this.controllers, this.#samples)
		return this.#resolver.poll(now, this.#samples)
	}
}

