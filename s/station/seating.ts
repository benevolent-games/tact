
import {SetG} from "@e280/stz"
import {Scalar} from "@benev/math"
import {Player} from "./player.js"
import {SeatedBindings} from "./types.js"
import {Device} from "./devices/infra/device.js"

export class Seating<B extends SeatedBindings> {
	devices = new SetG<Device>()

	constructor(public players: Player<B>[]) {
		for (const player of players) {
			const fn = (delta: 1 | -1) => () => {
				const device = this.deviceByPlayer(player)
				if (device) this.shimmy(device, delta)
			}
			player.actions.meta.playerNext.onDown(fn(1))
			player.actions.meta.playerPrevious.onDown(fn(-1))
			player.modes.add("meta")
		}
	}

	*[Symbol.iterator]() {
		yield* this.players.values()
	}

	*entries() {
		yield* this.players.entries()
	}

	poll(now: number) {
		for (const player of this.players)
			player.poll(now)
	}

	playerBySeat(seat: number) {
		const player = this.players.at(seat)
		if (!player) throw new Error(`player ${seat} not found`)
		return player
	}

	playerByDevice(device: Device) {
		for (const player of this.players) {
			if (player.devices.has(device))
				return player
		}
	}

	deviceByPlayer(player: Player<B>) {
		for (const device of this.devices) {
			if (player.devices.has(device))
				return device
		}
	}

	/** move a player's device forward or backward one seat */
	shimmy(device: Device, seatDelta: 1 | -1) {
		const oldSeat = this.players.findIndex(player => player.devices.has(device))
		const maxSeat = Math.max(0, this.players.length - 1)
		const newSeat = Scalar.clamp(oldSeat + seatDelta, 0, maxSeat)
		const player = this.playerBySeat(newSeat)
		this.connect(device, player)
		return player
	}

	/** plug in a player's device so they can play (maybe is a DeviceGroup) */
	connect<D extends Device>(
			device: D,
			player: Player<B> = this.chooseLonelyPlayer(),
		) {
		this.#removeDeviceFromAllPlayers(device)
		this.devices.add(device)
		player.devices.add(device)
		return device
	}

	/** unplug a player's device */
	disconnect(device: Device) {
		this.#removeDeviceFromAllPlayers(device)
		this.devices.delete(device)
	}

	/** returns player without an assigned device (otherwise the last player) */
	chooseLonelyPlayer() {
		for (const player of this.players) {
			if (!this.deviceByPlayer(player))
				return player
		}
		const seat = Math.max(0, this.players.length - 1)
		return this.playerBySeat(seat)
	}

	#removeDeviceFromAllPlayers(device: Device) {
		this.players.forEach(player => player.devices.delete(device))
	}
}

