
import {Bindings, Device} from "../core/types.js"
import {makeIntentsResolver} from "../core/resolvers/intents.js"

/** associate a device with particular bindings */
export class Controller<B extends Bindings, D extends Device = Device> {
	#resolveIntents
	#bindings: B

	constructor(
			bindings: B,
			public device: D,
		) {
		this.#bindings = bindings
		this.#resolveIntents = makeIntentsResolver(bindings)
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: B) {
		this.#bindings = bindings
		this.#resolveIntents = makeIntentsResolver(bindings)
	}

	resolveIntents(now: number) {
		return this.#resolveIntents(now, this.device.samples())
	}
}

