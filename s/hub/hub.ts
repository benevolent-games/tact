
import {RSet} from "@e280/strata"
import {Port} from "./port.js"
import {Bindings} from "../core/types.js"
import {Controller} from "./controller.js"

/** has a bunch of ports and their connected controllers */
export class Hub<B extends Bindings> {

	/** each port represents a player slot (eg, P1, P2, etc) */
	ports = new RSet<Port<B>>()

	/** special port for all unassigned controllers (we still might wanna listen to these, eg, "press any button to join") */
	unassigned = new Port<B>()

	/** we can initialize with some playable ports */
	constructor(...ports: Port<B>[]) {
		this.ports.adds(...ports)
	}

	/** move a controller to the special unassigned port */
	unassign(controller: Controller<B>) {
		this.unassigned.add(controller)
		for (const port of this.ports)
			port.delete(controller)
	}

	/** this controller no longer exists (not even unassigned) */
	forget(controller: Controller<B>) {
		for (const port of [this.unassigned, ...this.ports])
			port.delete(controller)
	}
}

