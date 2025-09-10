
import {Kv} from "@e280/kv"
import {range} from "@e280/stz"
import {Bindings} from "../../bindings/types.js"
import {mergeBindings} from "./merge-bindings.js"

export class BindingsDepot<B extends Bindings> {
	#kv: Kv<B>

	constructor(
			public readonly portCount: number,
			rootKv: Kv,
			public readonly fallbackBindings: B,
		) {
		this.#kv = rootKv.scope<B>("bindings")
	}

	async loadAll() {
		const indices = range(this.portCount)
		const keys = indices.map(k => k.toString())
		return (await this.#kv.gets(...keys))
			.map(suspect => mergeBindings(this.fallbackBindings, suspect))
	}

	async save(index: number, bindings: B) {
		await this.#kv.set(index.toString(), bindings)
	}
}

