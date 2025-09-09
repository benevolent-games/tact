
import {Scalar} from "@benev/math"
import {SetG, sub} from "@e280/stz"
import {Port} from "../port/port.js"
import {hubBindings} from "./bindings.js"
import {Actions} from "../bindings/types.js"
import {Controller} from "../controllers/controller.js"
import {HubFriendlyBindings, hubMode} from "./types.js"

export class Hub<B extends HubFriendlyBindings> {
	static readonly mode = hubMode
	static readonly bindings = hubBindings

	readonly controllers = new SetG<Controller>()
	readonly on = sub()

	constructor(public readonly ports: Port<B>[]) {
		for (const port of ports)
			port.modes.add(Hub.mode)
	}

	/** poll all the ports, and actuate hub bindings for shimmying */
	poll(now: number = Date.now()) {
		return this.ports.map(port => {
			const actions = port.poll(now)
			this.actuatePortActions(port, actions)
			return actions
		})
	}

	/** manually perform hub actions for the given port */
	actuatePortActions(port: Port<B>, actions: Actions<B>) {
		const fn = (delta: 1 | -1) => {
			const controller = this.controllerByPort(port)
			if (controller) this.shimmy(controller, delta)
		}
		if (actions[hubMode].shimmyNext.up) fn(1)
		if (actions[hubMode].shimmyPrevious.up) fn(-1)
	}

	/** check if a port has a known switchboard controller assigned */
	isPlugged(port: Port<B>) {
		return !!this.controllerByPort(port)
	}

	portByIndex(index: number) {
		const port = this.ports.at(index)
		if (!port) throw new Error(`port ${index} not found`)
		return port
	}

	portByController(controller: Controller) {
		for (const port of this.ports) {
			if (port.controllers.has(controller))
				return port
		}
	}

	controllerByPort(port: Port<B>) {
		for (const controller of this.controllers) {
			if (port.controllers.has(controller))
				return controller
		}
	}

	/** move a player's controller to the next or previous port */
	shimmy(controller: Controller, indexDelta: 1 | -1) {
		const oldIndex = this.ports.findIndex(port => port.controllers.has(controller))
		const maxIndex = Math.max(0, this.ports.length - 1)
		const newIndex = Scalar.clamp(oldIndex + indexDelta, 0, maxIndex)
		const port = this.portByIndex(newIndex)
		this.plug(controller, port)
		return port
	}

	/** plug a controller into a port */
	plug = (controller: Controller, port: Port<B> = this.getLonelyPort()) => {
		this.unplug(controller)
		this.controllers.add(controller)
		port.controllers.add(controller)
		this.on.publish()
		return () => this.unplug(controller)
	}

	/** unplug a controller */
	unplug(controller: Controller) {
		this.ports.forEach(port => port.controllers.delete(controller))
		this.controllers.delete(controller)
		this.on.publish()
	}

	/** returns an unplugged port (otherwise the last one) */
	getLonelyPort() {
		for (const port of this.ports) {
			if (!this.controllerByPort(port))
				return port
		}
		const index = Math.max(0, this.ports.length - 1)
		return this.portByIndex(index)
	}
}

