
import {ev} from "@e280/stz"
import {modprefix} from "../utils/modprefix.js"
import {SamplerDevice} from "./infra/sampler.js"
import {splitAxis} from "../../utils/split-axis.js"

export class PointerDevice extends SamplerDevice {
	clientX = 0
	clientY = 0
	movementX = 0
	movementY = 0
	dispose: () => void

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

	constructor(target: EventTarget) {
		super()

		const dispatch = (event: PointerEvent | WheelEvent, code: string, value: number) => {
			this.setSample(code, value)
			this.setSample(modprefix(event, code), value)
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
				for (const [code, value] of PointerDevice.wheelCodes(event))
					dispatch(event, code, value)
			},
		})
	}

	takeSamples() {
		const {movementX, movementY} = this
		const [left, right] = splitAxis(movementX)
		const [down, up] = splitAxis(movementY)

		if (movementX) {
			if (movementX >= 0)
				this.setSample(`pointer.move.right`, Math.abs(right))
			else
				this.setSample(`pointer.move.left`, Math.abs(left))
		}
		if (movementY) {
			if (movementY >= 0)
				this.setSample(`pointer.move.up`, Math.abs(up))
			else
				this.setSample(`pointer.move.down`, Math.abs(down))
		}

		this.movementX = 0
		this.movementY = 0

		return super.takeSamples()
	}
}

