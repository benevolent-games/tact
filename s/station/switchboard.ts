
import {SetG} from "@e280/stz"
import {Scalar} from "@benev/math"
import {Station} from "./station.js"
import {Device} from "./devices/infra/device.js"
import {switchboardMode, SwitchboardBindings} from "./types.js"
import {switchboardBindings} from "./parts/switchboard-bindings.js"

export class Switchboard<B extends SwitchboardBindings> {
	static readonly mode = switchboardMode
	static readonly bindings = switchboardBindings

	devices = new SetG<Device>()

	constructor(public stations: Station<B>[]) {
		for (const station of stations) {
			const fn = (delta: 1 | -1) => () => {
				const device = this.deviceByStation(station)
				if (device) this.shimmy(device, delta)
			}
			station.actions.switchboard.shimmyNext.onDown(fn(1))
			station.actions.switchboard.shimmyPrevious.onDown(fn(-1))
			station.modes.add(Switchboard.mode)
		}
	}

	*[Symbol.iterator]() {
		yield* this.stations.values()
	}

	*entries() {
		yield* this.stations.entries()
	}

	poll(now: number) {
		for (const station of this.stations)
			station.poll(now)
	}

	stationByIndex(index: number) {
		const station = this.stations.at(index)
		if (!station) throw new Error(`station ${index} not found`)
		return station
	}

	stationByDevice(device: Device) {
		for (const station of this.stations) {
			if (station.devices.has(device))
				return station
		}
	}

	deviceByStation(station: Station<B>) {
		for (const device of this.devices) {
			if (station.devices.has(device))
				return device
		}
	}

	/** move a player's device to the next or previous station */
	shimmy(device: Device, indexDelta: 1 | -1) {
		const oldIndex = this.stations.findIndex(station => station.devices.has(device))
		const maxIndex = Math.max(0, this.stations.length - 1)
		const newIndex = Scalar.clamp(oldIndex + indexDelta, 0, maxIndex)
		const station = this.stationByIndex(newIndex)
		this.connect(device, station)
		return station
	}

	/** plug in a player's device so they can play (maybe is a DeviceGroup) */
	connect<D extends Device>(
			device: D,
			station: Station<B> = this.chooseLonelyStation(),
		) {
		this.#removeDeviceFromAllStations(device)
		this.devices.add(device)
		station.devices.add(device)
		return device
	}

	/** unplug a player's device */
	disconnect(device: Device) {
		this.#removeDeviceFromAllStations(device)
		this.devices.delete(device)
	}

	/** returns an unassigned station (otherwise the last one) */
	chooseLonelyStation() {
		for (const station of this.stations) {
			if (!this.deviceByStation(station))
				return station
		}
		const index = Math.max(0, this.stations.length - 1)
		return this.stationByIndex(index)
	}

	#removeDeviceFromAllStations(device: Device) {
		this.stations.forEach(station => station.devices.delete(device))
	}
}

