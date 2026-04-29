
import {RSet} from "@e280/strata"
import {Port} from "./port.js"
import {Bindings} from "../core/types.js"
import {Controller} from "./controller.js"
import {onPad} from "../device/parts/pad.js"
import {GamepadDevice} from "../device/gamepad.js"

export class Deck<B extends Bindings> {
	ports = new RSet<Port<B>>()
	unassigned = new Port<B>()

	constructor(...ports: Port<B>[]) {
		this.ports.adds(...ports)
	}

	remove(controller: Controller<B>) {
		for (const port of [this.unassigned, ...this.ports])
			port.delete(controller)
	}

	autoGamepads(bindings: B, fn: (controller: Controller<B, GamepadDevice>) => () => void = () => () => {}) {
		return onPad(pad => {
			const device = new GamepadDevice(pad)
			const controller = new Controller(bindings, device)
			const dispose = fn(controller)
			return () => {
				this.remove(controller)
				dispose()
			}
		})
	}
}

