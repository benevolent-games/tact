
import {SetG} from "@e280/stz"
import {Resolver} from "./parts/resolver.js"
import {Bindings, SampleMap} from "./types.js"
import {Device} from "./devices/infra/device.js"
import {aggregate_samples_into_map} from "./parts/routines/aggregate_samples_into_map.js"

export class Station<B extends Bindings> {
	readonly modes = new SetG<keyof B>()
	readonly devices = new SetG<Device>()

	#resolver: Resolver<B>
	#samples: SampleMap = new Map()

	constructor(bindings: B) {
		this.#resolver = new Resolver(bindings, this.modes, this.#samples)
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

	addModes(...modes: (keyof B)[]) {
		this.modes.adds(...modes)
		return this
	}

	addDevices(...devices: Device[]) {
		this.devices.adds(...devices)
		return this
	}

	poll(now: number) {
		this.#samples.clear()
		aggregate_samples_into_map(this.devices, this.#samples)
		this.#resolver.poll(now)
	}
}

