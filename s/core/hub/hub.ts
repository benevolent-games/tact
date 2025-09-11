
import {Scalar} from "@benev/math"
import {debounce, MapG, sub} from "@e280/stz"
import {Port} from "./port.js"
import {metaMode} from "./types.js"
import {Device} from "../devices/device.js"
import {Bindings} from "../bindings/types.js"
import {Connected} from "./parts/connected.js"
import {makeMetaBindings} from "./meta-bindings.js"
import {SampleMap} from "../bindings/sample-map.js"

export class Hub<B extends Bindings> {

	/** event fires whenever a device changes ports. */
	readonly on = sub()

	/** all devices known to this hub */
	#connected = new MapG<Device, Connected>()

	constructor(

		/** available ports that devices can be assigned to. */
		public readonly ports: Port<B>[],

		/** special bindings for devices to shimmy between ports. */
		public metaBindings = makeMetaBindings(),
	) {}

	/** poll every device, providing actions for each port, and internally handling meta actions. */
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

	portByDevice(device: Device) {
		for (const port of this.ports) {
			if (port.devices.has(device))
				return port
		}
	}

	getMetaActions(devices: Device) {
		return this.#connected.require(devices).metaResolver.actions
	}

	/** move a player's device to the next or previous port */
	shimmy(device: Device, indexDelta: 1 | -1) {
		const oldIndex = this.ports.findIndex(port => port.devices.has(device))
		const maxIndex = Math.max(0, this.ports.length - 1)
		const newIndex = Scalar.clamp(oldIndex + indexDelta, 0, maxIndex)
		const port = this.portByIndex(newIndex)
		this.reassign(device, port)
		return port
	}

	reassign(device: Device, port = this.getLonelyPort()) {
		this.ports.forEach(port => port.devices.delete(device))
		port.devices.add(device)
		this.#dispatchChange()
	}

	/** unplug a device */
	unplug(device: Device) {
		this.ports.forEach(port => port.devices.delete(device))
		this.#connected.delete(device)
		this.#dispatchChange()
	}

	/** plug a device into a port */
	plug = (device: Device, port = this.getLonelyPort()) => {
		this.unplug(device)
		this.#connected.set(device, new Connected(device, this.metaBindings))
		port.devices.add(device)
		this.#dispatchChange()
		return () => this.unplug(device)
	}

	/** returns an unplugged port (otherwise the last one) */
	getLonelyPort() {
		for (const port of this.ports) {
			if (port.devices.size === 0)
				return port
		}
		const index = Math.max(0, this.ports.length - 1)
		return this.portByIndex(index)
	}

	#dispatchChange = debounce(0, () => this.on.publish())

	#actuateMetaActions(now: number, connected: Connected) {
		const metaActions = connected.metaResolver.resolve(now, connected.samples)
		if (metaActions[metaMode].shimmyNext.down) this.shimmy(connected.device, 1)
		if (metaActions[metaMode].shimmyPrevious.down) this.shimmy(connected.device, -1)
	}

	#resolvePortActions(now: number) {
		return this.ports.map(port => {
			const samples = SampleMap.combine(
				...port.devices.array()
					.map(device => this.#connected.require(device).samples)
			)
			return port.resolve(now, samples)
		})
	}
}

