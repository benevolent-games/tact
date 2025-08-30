
import {loop} from "@e280/stz"
import {Scalar} from "@benev/math"

import {Port} from "./port.js"
import {Inputs} from "../inputs.js"
import {Device} from "../parts/device.js"
import {SeatedBindings} from "../types.js"

export class Seating<B extends SeatedBindings> {
	#ports = new Set<Port>()

	constructor(public seats: Inputs<B>[]) {
		for (const [id, seat] of seats.entries()) {
			const fn = (delta: 1 | -1) => () => {
				const port = this.lookupPort(id)
				if (port) this.shimmy(port, delta)
			}
			seat.actions.meta.playerNext.onDown(fn(1))
			seat.actions.meta.playerPrevious.onDown(fn(-1))
			seat.modes.add("meta")
		}
	}

	*[Symbol.iterator]() {
		yield* this.seats.values()
	}

	*entries() {
		yield* this.seats.entries()
	}

	requireSeat(seatId: number) {
		const seat = this.seats.at(seatId)
		if (!seat) throw new Error(`seat ${seatId} not found`)
		return seat
	}

	lookupPort(seatId: number) {
		for (const port of this.#ports) {
			if (port.seatId === seatId)
				return port
		}
	}

	hasPort(port: Port) {
		return this.#ports.has(port)
	}

	assign(port: Port, seatId: number) {
		this.#unassign(port)
		const seat = this.requireSeat(seatId)
		seat.addDevices(...port.devices)
		port.seatId = seatId
		return seat
	}

	#unassign(port: Port) {
		const seat = this.requireSeat(port.seatId)
		seat.devices.deletes(...port.devices)
	}

	shimmy(port: Port, delta: 1 | -1) {
		const lastSeatId = this.seats.length - 1
		const newSeatId = Scalar.clamp(port.seatId + delta, 0, lastSeatId)
		this.assign(port, newSeatId)
	}

	connect(...devices: Device[]) {
		const seatId = this.chooseSeatId()
		const port = new Port(seatId, devices)
		this.#ports.add(port)
		this.assign(port, seatId)
		return port
	}

	disconnect(port: Port) {
		this.#unassign(port)
		this.#ports.delete(port)
	}

	/** returns the first unassigned seat id, or the last id if they're all assigned */
	chooseSeatId() {
		for (const id of loop(this.seats.length)) {
			const port = [...this.#ports].find(port => port.seatId === id)
			if (!port) return id
		}
		return this.seats.length - 1
	}
}

/*

// reserving four seats
const seating = new Seating([
	new Inputs(bindings),
	new Inputs(bindings),
	new Inputs(bindings),
	new Inputs(bindings),
])

// connect the keyboard and mouse player
seating.connect(
	new KeyboardDevice(),
	new PointerDevice(),
)

// connect and disconnect gamepads as they come and go
const gamepads = new Gamepads(device => {
	const port = seating.connect(device)
	return () => port.disconnect()
})

*/

