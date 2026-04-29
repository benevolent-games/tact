
import {RSet} from "@e280/strata"
import {Port} from "./port.js"
import {Bindings} from "../core/types.js"
import {Controller} from "./controller.js"
import {onPad} from "../device/parts/pad.js"
import {GamepadDevice} from "../device/gamepad.js"

export class Deck<B extends Bindings> {
	ports = new RSet<Port<B>>()
	unassigned = new Port<B>()

	constructor(public bindings: B, ...ports: Port<B>[]) {
		this.ports.adds(...ports)
	}

	remove(controller: Controller<B>) {
		for (const port of [this.unassigned, ...this.ports])
			port.delete(controller)
	}

	autoGamepads(fn: (controller: Controller<B>) => void = () => {}) {
		return onPad(pad => {
			const device = new GamepadDevice(pad)
			const controller = new Controller(this.bindings, device)
			fn(controller)
			return () => this.remove(controller)
		})
	}
}

