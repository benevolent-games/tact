
import {Scalar} from "@benev/math"
import {Port} from "./port.js"
import {MapG, SetG, sub} from "@e280/stz"
import {metaBindings} from "./bindings.js"
import {Resolver} from "../bindings/resolver.js"
import {MetaBindings, metaMode} from "./types.js"
import {Actions, Bindings} from "../bindings/types.js"
import {Controller} from "../controllers/controller.js"
import { SampleMap } from "../bindings/sample-map.js"

export class Hub<B extends Bindings> {
	static readonly metaMode = metaMode
	static readonly metaBindings = metaBindings

	/** special bindings for controllers to shimmy between ports. */
	metaBindings = metaBindings()

	/** all controllers known to this hub. */
	readonly controllers = new SetG<Controller>()

	/** event fires whenever a controller changes ports. */
	readonly on = sub()

	/** special resolvers hard-attached to each controller, listening for meta actions like shimmy between ports. */
	#metaResolvers = new MapG<Controller, Resolver<MetaBindings>>()

	constructor(

		/** available ports that controllers can be assigned to. */
		public readonly ports: Port<B>[],
	) {}

	/** poll every controller, providing actions for each port, and internally handling meta actions. */
	poll(now = Date.now()) {
		const samplemapByController = new MapG<Controller, SampleMap>()

		for (const controller of this.controllers) {
			const samples = new SampleMap(controller.takeSamples())
			samplemapByController.set(controller, samples)

			// actuate meta actions
			const metaResolver = this.#metaResolvers.require(controller)
			const metaActions = metaResolver.resolve(now, samples)
			if (metaActions[metaMode].shimmyNext.down) this.shimmy(controller, 1)
			if (metaActions[metaMode].shimmyPrevious.down) this.shimmy(controller, -1)
		}

		return this.ports.map(port => {
			const samples = SampleMap.combine(
				...port.controllers.array()
					.map(controller => samplemapByController.require(controller))
			)
			return port.resolve(now, samples)
		})
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

