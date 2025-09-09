
import {Scalar} from "@benev/math"
import {debounce, MapG, sub} from "@e280/stz"
import {Port} from "./port.js"
import {metaMode} from "./types.js"
import {metaBindings} from "./bindings.js"
import {Bindings} from "../bindings/types.js"
import {SampleMap} from "../bindings/sample-map.js"
import {Controller} from "../controllers/controller.js"
import {ConnectedController} from "./parts/connected-controller.js"

export class Hub<B extends Bindings> {

	/** event fires whenever a controller changes ports. */
	readonly on = sub()

	/** special bindings for controllers to shimmy between ports. */
	metaBindings = metaBindings()

	/** all controllers known to this hub */
	#connected = new MapG<Controller, ConnectedController>()

	constructor(

		/** available ports that controllers can be assigned to. */
		public readonly ports: Port<B>[],
	) {}

	/** poll every controller, providing actions for each port, and internally handling meta actions. */
	poll(now = Date.now()) {
		for (const connected of this.#connected.values())
			connected.refreshSamples()

		for (const connected of this.#connected.values())
			this.#actuateMetaActions(now, connected)

		return this.#resolvePortActions(now)
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

	/** move a player's controller to the next or previous port */
	shimmy(controller: Controller, indexDelta: 1 | -1) {
		const oldIndex = this.ports.findIndex(port => port.controllers.has(controller))
		const maxIndex = Math.max(0, this.ports.length - 1)
		const newIndex = Scalar.clamp(oldIndex + indexDelta, 0, maxIndex)
		const port = this.portByIndex(newIndex)
		this.reassign(controller, port)
		return port
	}

	reassign(controller: Controller, port = this.getLonelyPort()) {
		this.ports.forEach(port => port.controllers.delete(controller))
		port.controllers.add(controller)
		this.#dispatchChange()
	}

	/** unplug a controller */
	unplug(controller: Controller) {
		this.ports.forEach(port => port.controllers.delete(controller))
		this.#connected.delete(controller)
		this.#dispatchChange()
	}

	/** plug a controller into a port */
	plug = (controller: Controller, port = this.getLonelyPort()) => {
		this.unplug(controller)
		this.#connected.set(controller, new ConnectedController(controller, this.metaBindings))
		port.controllers.add(controller)
		this.#dispatchChange()
		return () => this.unplug(controller)
	}

	/** returns an unplugged port (otherwise the last one) */
	getLonelyPort() {
		for (const port of this.ports) {
			if (port.controllers.size === 0)
				return port
		}
		const index = Math.max(0, this.ports.length - 1)
		return this.portByIndex(index)
	}

	#dispatchChange = debounce(0, () => this.on.publish())

	#actuateMetaActions(now: number, connected: ConnectedController) {
		const metaActions = connected.metaResolver.resolve(now, connected.samples)
		if (metaActions[metaMode].shimmyNext.down) this.shimmy(connected.controller, 1)
		if (metaActions[metaMode].shimmyPrevious.down) this.shimmy(connected.controller, -1)
	}

	#resolvePortActions(now: number) {
		return this.ports.map(port => {
			const samples = SampleMap.combine(
				...port.controllers.array()
					.map(controller => this.#connected.require(controller).samples)
			)
			return port.resolve(now, samples)
		})
	}
}

