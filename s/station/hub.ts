
import {SetG} from "@e280/stz"
import {Scalar} from "@benev/math"
import {Port} from "./port.js"
import {Controller} from "./controllers/infra/controller.js"
import {hubBindings} from "./parts/hub-bindings.js"
import {switchboardMode, HubBindings} from "./types.js"

export class Hub<B extends HubBindings> {
	static readonly mode = switchboardMode
	static readonly bindings = hubBindings

	readonly controllers = new SetG<Controller>()

	constructor(public readonly ports: Port<B>[]) {
		for (const port of ports) {
			const fn = (delta: 1 | -1) => () => {
				const controller = this.controllerByPort(port)
				if (controller) this.shimmy(controller, delta)
			}
			port.actions.switchboard.shimmyNext.onDown(fn(1))
			port.actions.switchboard.shimmyPrevious.onDown(fn(-1))
			port.modes.add(Hub.mode)
		}
	}

	*[Symbol.iterator]() {
		yield* this.ports.values()
	}

	*entries() {
		yield* this.ports.entries()
	}

	/** poll all the ports */
	poll(now: number) {
		for (const port of this.ports)
			port.poll(now)
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
	plug(
			controller: Controller,
			port: Port<B> = this.getLonelyPort(),
		) {
		this.unplug(controller)
		this.controllers.add(controller)
		port.controllers.add(controller)
		return () => this.unplug(controller)
	}

	/** unplug a controller */
	unplug(controller: Controller) {
		this.ports.forEach(port => port.controllers.delete(controller))
		this.controllers.delete(controller)
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

