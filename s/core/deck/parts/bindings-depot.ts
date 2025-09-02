
import {Kv} from "@e280/kv"
import {deep, range} from "@e280/stz"
import {HubFriendlyBindings} from "../../bindings/types.js"

export class BindingsDepot<B extends HubFriendlyBindings> {
	#kv: Kv<B>

	constructor(public readonly portCount: number, rootKv: Kv) {
		this.#kv = rootKv.scope("bindings")
	}

	async loadAll() {
		const indices = range(this.portCount)
		const keys = indices.map(k => k.toString())
		return (await this.#kv.gets(...keys))
			.map(bindings => bindings ?? deep.clone(bindings)) as B[]
	}

	async save(index: number, bindings: B) {
		await this.#kv.set(index.toString(), bindings)
	}
}

