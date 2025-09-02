
import {Kv} from "@e280/kv"
import {Hub} from "../hub/hub.js"
import {Port} from "../port/port.js"
import {HubFriendlyBindings} from "../hub/types.js"
import {BindingsDepot} from "./parts/bindings-depot.js"

export class Deck<B extends HubFriendlyBindings> {
	static async load<B extends HubFriendlyBindings>(options: {
			portCount: number
			kv: Kv
			bindings: B
		}) {
		const bindingsDepot = new BindingsDepot<B>(options.portCount, options.kv)
		const bindings = await bindingsDepot.loadAll()
		const ports = bindings.map(b => new Port(b))
		const hub = new Hub<B>(ports)
		return new this(hub, bindingsDepot)
	}

	constructor(
		public readonly hub: Hub<B>,
		private bindingsDepot: BindingsDepot<B>,
	) {}

	async reload() {
		const allBindings = await this.bindingsDepot.loadAll()
		for (const [index, bindings] of allBindings.entries()) {
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

