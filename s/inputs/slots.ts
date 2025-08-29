
import {Scalar} from "@benev/math"
import {loop, MapG} from "@e280/stz"

import {Inputs} from "./inputs.js"
import {Bindings} from "./types.js"
import {Device} from "./parts/device.js"

export class Slots<T> {
	#numbers = new MapG<T, number>()
	#objects = new MapG<number, T>()
	constructor(public readonly count: number) {}

	assign(n: number, object: T) {
		const previousN = this.#numbers.get(object)
		if (previousN) this.#objects.delete(previousN)
		this.#numbers.set(object, n)
		this.#objects.set(n, object)
	}

	reassignShimmy(object: T, delta: number) {
		const previousN = this.lookup(object)
		const proposedN = Scalar.clamp(previousN + delta, 0, this.count - 1)
		const isChanged = previousN !== proposedN
		if (isChanged)
			this.assign(proposedN, object)
	}

	get(n: number) {
		return this.#objects.get(n)
	}

	require(n: number) {
		return this.#objects.require(n)
	}

	*[Symbol.iterator]() {
		yield* this.#objects.values()
	}

	lookup(object: T) {
		return this.#numbers.require(object)
	}

	delete(object: T) {
		const n = this.#numbers.get(object)
		if (n) {
			this.#numbers.delete(object)
			this.#objects.delete(n)
		}
	}
}

export class Players<B extends Bindings> {
	slots: Slots<Inputs<B>>

	constructor(public readonly count: number, getBindings: (player: number) => B) {
		this.slots = new Slots(count)
		for (const player of loop(count))
			this.slots.assign(player, new Inputs(getBindings(player)))
	}

	connect(player: number, devices: Device[]) {
		const inputs = this.slots.require(player)
		for (const device of devices)
			inputs.devices.add(device)
	}

	disconnect(player: number, devices: Device[]) {
		const inputs = this.slots.require(player)
		for (const device of devices)
			inputs.devices.delete(device)
	}

	poll(now: number) {
		for (const inputs of this.slots)
			inputs.poll(now)
	}
}

/*

const gamepads = makeGamepads(4)
const players = new Players(4, getBindings)

// reserve keyboard-mouse slot
players.connect(0, [
	new KeyboardDevice()
	new PointerDevice()
])

// reserve prospective gamepad slots
for (const player of pads)
	players.connect(player, [gamepads.require(player).device])

// handle player slot reassignments
for (const inputs of player.slots) {
	inputs.actions.meta.playerNext.onDown(() => {
		players.slots.reassignShimmy(inputs, 1)
	})
	inputs.actions.meta.playerPrevious.onDown(() => {
		players.slots.reassignShimmy(inputs, -1)
	})
}

*/

