
import {Scalar} from "@benev/math"
import {Inputs} from "../inputs.js"
import {SetG} from "../../utils/set-g.js"
import {Device} from "../parts/device.js"
import {SeatedBindings} from "../types.js"

/** orchestrate multiple player devices onto player seats */
export class Seating<B extends SeatedBindings> {
	devices = new SetG<Device>()

	constructor(public seats: Inputs<B>[]) {
		for (const seat of seats) {
			const fn = (delta: 1 | -1) => () => {
				const device = this.lookupDevice(seat)
				if (device) this.shimmy(device, delta)
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

	poll(now: number) {
		for (const seat of this.seats)
			seat.poll(now)
	}

	seatById(seatId: number) {
		const seat = this.seats.at(seatId)
		if (!seat) throw new Error(`seat ${seatId} not found`)
		return seat
	}

	lookupSeat(device: Device) {
		for (const seat of this.seats) {
			if (seat.devices.has(device))
				return seat
		}
	}

	lookupDevice(seat: Inputs<B>) {
		for (const device of this.devices) {
			if (seat.devices.has(device))
				return device
		}
	}

	shimmy(device: Device, delta: 1 | -1) {
		const oldSeatId = this.seats.findIndex(seat => seat.devices.has(device))
		const maxSeatId = Math.max(0, this.seats.length - 1)
		const newSeatId = Scalar.clamp(oldSeatId + delta, 0, maxSeatId)
		const newSeat = this.seatById(newSeatId)
		this.seats.forEach(seat => seat.devices.delete(device))
		newSeat.devices.add(device)
		return newSeat
	}

	connect<D extends Device>(device: D, seat: Inputs<B> = this.chooseSeat()) {
		this.seats.forEach(seat => seat.devices.delete(device))
		this.devices.add(device)
		seat.devices.add(device)
		return device
	}

	disconnect(device: Device) {
		this.seats.forEach(seat => seat.devices.delete(device))
		this.devices.delete(device)
	}

	/** returns the first unassigned seat id, or the last id if they're all assigned */
	chooseSeat() {
		for (const seat of this.seats) {
			if (!this.lookupDevice(seat))
				return seat
		}
		return this.seatById(Math.max(0, this.seats.length - 1))
	}
}

