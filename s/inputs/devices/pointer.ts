
import {ev, sub} from "@e280/stz"
import {Sample} from "../types.js"
import {Device} from "../parts/device.js"
import {Sampler} from "../utils/sampler.js"
import {modprefix} from "../utils/modprefix.js"
import {splitAxis} from "../utils/split-axis.js"

export class PointerDevice extends Device {
	on = sub<Sample>()
	dispose: () => void
	#sampler = new Sampler()

	clientX = 0
	clientY = 0
	movementX = 0
	movementY = 0

	static buttonCode(event: PointerEvent) {
		switch (event.button) {
			case 0: return "LMB"
			case 1: return "MMB"
			case 2: return "RMB"
			default: return `MB${event.button + 1}`
		}
	}

	static wheelCodes(event: WheelEvent) {
		const movements: [string, number][] = []

		if (event.deltaX)
			movements.push([
				event.deltaX > 0 ? "WheelRight" : "WheelLeft",
				event.deltaX,
			])

		if (event.deltaY)
			movements.push([
				event.deltaY > 0 ? "WheelDown" : "WheelUp",
				event.deltaY,
			])

		return movements
	}

	constructor(target: EventTarget) {
		super()

		const dispatch = (event: PointerEvent, code: string, value: number) => {
			this.#publish(code, value)
			this.#publish(modprefix(event, code), value)
		}

		this.dispose = ev(target, {
			pointerdown: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				dispatch(event, code, 1)
			},

			pointerup: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				dispatch(event, code, 0)
			},

			pointermove: (event: PointerEvent) => {
				this.clientX = event.clientX
				this.clientY = event.clientY
				this.movementX += event.movementX
				this.movementY += event.movementY
			},

			wheel: (event: WheelEvent) => {
				for (const [code, value] of PointerDevice.wheelCodes(event)) {
					this.#publish(code, value)
					this.#publish(modprefix(event, code), value)
				}
			},
		})
	}

	#publish(code: string, value: number) {
		this.#sampler.set(code, value)
		this.on.pub(code, value)
	}

	collectMovement() {
		const {movementX, movementY} = this
		const [left, right] = splitAxis(movementX)
		const [down, up] = splitAxis(movementY)

		if (movementX) {
			if (movementX >= 0)
				this.#publish(`PointerMoveRight`, Math.abs(right))
			else
				this.#publish(`PointerMoveLeft`, Math.abs(left))
		}
		if (movementY) {
			if (movementY >= 0)
				this.#publish(`PointerMoveUp`, Math.abs(up))
			else
				this.#publish(`PointerMoveDown`, Math.abs(down))
		}

		this.movementX = 0
		this.movementY = 0
	}

	samples() {
		this.collectMovement()
		return this.#sampler.samples()
	}
}

