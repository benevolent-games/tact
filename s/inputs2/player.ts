
import {SetG} from "@e280/stz"
import {Bindings} from "./types.js"
import {Device} from "./devices/device.js"
import {Resolver} from "./parts/resolver.js"
import {collectSamples} from "./utils/collect-samples.js"

export class Player<B extends Bindings> {
	readonly modes = new SetG<keyof B>()
	readonly devices = new SetG<Device>()
	#resolver: Resolver<B>

	constructor(bindings: B) {
		this.#resolver = new Resolver(bindings, this.modes)
	}

	get actions() {
		return this.#resolver.actions
	}

	get bindings() {
		return this.#resolver.bindings
	}

	set bindings(bindings: B) {
		this.#resolver.bindings = bindings
	}

	poll(now: number) {
		const samples = collectSamples(...this.devices)
		this.#resolver.poll({now, samples})
	}
}

