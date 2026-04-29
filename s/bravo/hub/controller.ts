
import {makeTable} from "../core/make/table.js"
import {Bindings, Device} from "../core/types.js"
import {makeIntentsResolver} from "../core/make/intents-resolver.js"

export class Controller<B extends Bindings> {
	#resolveIntents
	#bindings: B

	constructor(
			bindings: B,
			public device: Device,
		) {
		this.#bindings = bindings
		this.#resolveIntents = makeIntentsResolver(makeTable(bindings))
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: B) {
		this.#bindings = bindings
		this.#resolveIntents = makeIntentsResolver(makeTable(bindings))
	}

	resolveIntents(now: number) {
		return this.#resolveIntents(now, this.device.samples())
	}
}

