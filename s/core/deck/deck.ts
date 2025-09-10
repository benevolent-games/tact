
import {Kv} from "@e280/kv"
import {Hub} from "../hub/hub.js"
import {Port} from "../hub/port.js"
import {Bindings} from "../bindings/types.js"
import {BindingsDepot} from "./parts/bindings-depot.js"

export class Deck<B extends Bindings> {
	static async load<B extends Bindings>(options: {
			portCount: number
			kv: Kv
			bindings: B
		}) {
		const bindingsDepot = new BindingsDepot<B>(options.portCount, options.kv, options.bindings)
		const bindingsList = await bindingsDepot.loadAll()
		const ports = bindingsList.map(b => new Port(b))
		const hub = new Hub<B>(ports)
		return new this(hub, bindingsDepot)
	}

	constructor(
		public readonly hub: Hub<B>,
		private bindingsDepot: BindingsDepot<B>,
	) {}

	async reload() {
		const bindingsList = await this.bindingsDepot.loadAll()
		for (const [index, bindings] of bindingsList.entries()) {
			const port = this.hub.ports.at(index)!
			port.bindings = bindings
		}
	}

	async save(index: number, bindings: B) {
		const port = this.hub.ports.at(index)!
		port.bindings = bindings
		await this.bindingsDepot.save(index, bindings)
	}
}

