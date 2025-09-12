
import {Scalar} from "@benev/math"
import {debounce, MapG, sub} from "@e280/stz"
import {Port} from "./port.js"
import {Device} from "../devices/device.js"
import {Bindings} from "../bindings/types.js"
import {Connected} from "./parts/connected.js"
import {MetaBindings, metaMode} from "./types.js"
import {makeMetaBindings} from "./meta-bindings.js"

export class Hub<B extends Bindings, MB extends MetaBindings = MetaBindings> {

	/** event fires whenever a device changes ports. */
	readonly on = sub()

	/** all devices known to this hub */
	#connected = new MapG<Device, Connected>()

	metaPort: Port<MB>

	constructor(

			/** available ports that devices can be assigned to. */
			public readonly ports: Port<B>[],

			/** special bindings for devices to shimmy between ports. */
			public metaBindings = makeMetaBindings() as MB,
		) {

		this.metaPort = new Port<MB>(metaBindings)
	}

	/** poll every device, providing actions for each port, and internally handling meta actions. */
	poll(now = Date.now()) {
		this.#resolveMetaPort(now)
		this.#actuateMetaActions(now)
		return this.#resolvePorts(now)
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
		let smallest = this.ports.at(0)!
		for (const port of this.ports) {
			if (port.devices.size < smallest.devices.size)
				smallest = port
		}
		return smallest
	}

	#dispatchChange = debounce(0, () => this.on.publish())

	#resolveMetaPort(now: number) {
		this.metaPort.devices.clear()
		this.metaPort.devices.adds(...this.#connected.keys())
		this.metaPort.resolve(now)
	}

	#actuateMetaActions(now: number) {
		for (const connected of this.#connected.values()) {
			const actions = connected.metaPort.resolve(now)
			if (actions[metaMode].shimmyNext.down) this.shimmy(connected.device, 1)
			if (actions[metaMode].shimmyPrevious.down) this.shimmy(connected.device, -1)
		}
	}

	#resolvePorts(now: number) {
		return this.ports.map(port => port.resolve(now))
	}
}

