
import {Bindings} from "../bindings.js"
import {BindingsData} from "../types.js"
import {Device} from "../device/types.js"
import {makeActivityResolver} from "../make-activity-resolver.js"

export class Controller<B extends BindingsData> {
	#resolveActivity
	#bindings: Bindings<B>

	constructor(
			bindings: Bindings<B>,
			public device: Device,
		) {
		this.#bindings = bindings
		this.#resolveActivity = makeActivityResolver(bindings)
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: Bindings<B>) {
		this.#bindings = bindings
		this.#resolveActivity = makeActivityResolver(bindings)
	}

	resolveActivity(now: number) {
		return this.#resolveActivity(now, this.device.samples())
	}
}

