
import {Vec2} from "@benev/math"
import {disposer, ev} from "@e280/stz"
import {SamplerDevice} from "../infra/sampler.js"
import {splitAxis} from "../../../utils/split-axis.js"

export class PointerDevice extends SamplerDevice {
	client = new Vec2(0, 0)
	movement = new Vec2(0, 0)
	dispose = disposer()

	constructor(target: EventTarget = window) {
		super()

		this.dispose.schedule(ev(target, {
			pointerdown: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				this.setSample(code, 1)
			},

			pointerup: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				this.setSample(code, 0)
			},

			pointermove: (event: PointerEvent) => {
				this.client.x = event.clientX
				this.client.y = event.clientY
				this.movement.x += event.movementX
				this.movement.y += event.movementY
			},

			wheel: (event: WheelEvent) => {
				for (const [code, value] of PointerDevice.wheelCodes(event))
					this.setSample(code, value)
			},
		}))
	}

	static buttonCode(event: PointerEvent) {
		switch (event.button) {
			case 0: return "pointer.button.left"
			case 1: return "pointer.button.middle"
			case 2: return "pointer.button.right"
			default: return `pointer.button.${event.button + 1}`
		}
	}

	static wheelCodes(event: WheelEvent) {
		const movements: [string, number][] = []

		if (event.deltaX)
			movements.push([
				event.deltaX > 0 ? "pointer.wheel.right" : "pointer.wheel.left",
				event.deltaX,
			])

		if (event.deltaY)
			movements.push([
				event.deltaY > 0 ? "pointer.wheel.down" : "pointer.wheel.up",
				event.deltaY,
			])

		return movements
	}

	samples() {
		this.#specialPreProcessing()
		return super.samples()
	}

	#specialPreProcessing() {
		const [x, y] = this.movement
		const [left, right] = splitAxis(x)
		const [down, up] = splitAxis(y)

		if (x) {
			if (x >= 0)
				this.setSample(`pointer.move.right`, Math.abs(right))
			else
				this.setSample(`pointer.move.left`, Math.abs(left))
		}
		if (y) {
			if (y >= 0)
				this.setSample(`pointer.move.up`, Math.abs(up))
			else
				this.setSample(`pointer.move.down`, Math.abs(down))
		}

		this.movement.set_(0, 0)
	}
}

