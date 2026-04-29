
import {SetG} from "@e280/stz"
import {Bindings} from "../bindings/types.js"
import {Resolver} from "../bindings/resolver.js"
import {SampleMap} from "../bindings/sample-map.js"
import {GroupDevice} from "../devices/infra/group.js"

export class Port<B extends Bindings> extends Resolver<B> {
	#group = new GroupDevice()

	readonly devices = this.#group.devices
	readonly modes = new SetG<keyof B>()

	constructor(bindings: B) {
		super(bindings)

		// start with all modes enabled by default
		this.modes.adds(...Object.keys(bindings))
	}

	resolve(now = Date.now()) {
		const sampleMap = new SampleMap(this.#group.samples())
		return super.resolve(now, this.modes, sampleMap)
	}
}

