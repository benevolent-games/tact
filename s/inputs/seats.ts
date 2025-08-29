
import {loop} from "@e280/stz"
import {Scalar} from "@benev/math"
import {Inputs} from "./inputs.js"
import {Device} from "./parts/device.js"
import {StandardBindings} from "./types.js"

export class Seating<B extends StandardBindings> {
	#ports = new Set<Port<B>>()

	constructor(public seats: Inputs<B>[]) {
		for (const [id, seat] of seats.entries()) {
			seat.actions.meta.playerNext.onDown(() => this.lookupPort(id)?.shimmy(1))
			seat.actions.meta.playerPrevious.onDown(() => this.lookupPort(id)?.shimmy(-1))
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

	hasPort(port: Port<B>) {
		return this.#ports.has(port)
	}

	assign(port: Port<B>, seatId: number) {
		this.#unassign(port)
		const seat = this.requireSeat(seatId)
		seat.attach(...port.devices)
		port.seatId = seatId
		return seat
	}

	#unassign(port: Port<B>) {
		if (port.seatId !== null) {
			const seat = this.requireSeat(port.seatId)
			seat.detach(...port.devices)
			port.seatId = null
		}
	}

	connect(...devices: Device[]) {
		const seatId = this.chooseSeatId()
		const port = new Port<B>(this, seatId, devices)
		this.#ports.add(port)
		this.assign(port, seatId)
		return port
	}

	disconnect(port: Port<B>) {
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

export class Port<B extends StandardBindings> {
	constructor(
		public seating: Seating<B>,
		public seatId: number | null,
		public devices: Device[],
	) {}

	get seat() {
		if (this.seatId === null) throw new Error("not connected")
		return this.seating.requireSeat(this.seatId)
	}

	assign(newSeatId: number) {
		this.seating.assign(this, newSeatId)
	}

	disconnect() {
		this.seating.disconnect(this)
	}

	shimmy(delta: 1 | -1) {
		if (this.seatId === null) throw new Error("not connected")
		const lastSeatId = this.seating.seats.length - 1
		const newSeatId = Scalar.clamp(this.seatId + delta, 0, lastSeatId)
		this.assign(newSeatId)
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
	const player = seating.connect(device)
	return () => port.disconnect()
})

*/

