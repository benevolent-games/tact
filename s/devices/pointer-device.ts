
import {ev} from "@e280/stz"
import {Device} from "./device.js"
import {modprefix} from "../utils/modprefix.js"
import {splitAxis} from "../utils/split-axis.js"

export class PointerDevice extends Device {
	dispose: () => void

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
		else if (event.deltaY)
			movements.push([
				event.deltaY > 0 ? "WheelDown" : "WheelUp",
				event.deltaY,
			])

		return movements
	}

	constructor(target: EventTarget) {
		super()

		const dispatch = (event: PointerEvent, code: string, value: number) => {
			this.onInput.pub(code, value)
			this.onInput.pub(`${modprefix(event)}-${code}`, value)
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
					this.onInput.pub(code, value)
			},
		})
	}

	poll() {
		const dispatch = (code: string, value: number) => {
			this.onInput.pub(code, value)
		}

		const {movementX, movementY} = this
		const [left, right] = splitAxis(movementX)
		const [down, up] = splitAxis(movementY)

		if (movementX) {
			if (movementX >= 0)
				dispatch(`PointerMoveRight`, Math.abs(right))
			else
				dispatch(`PointerMoveLeft`, Math.abs(left))
		}
		if (movementY) {
			if (movementY >= 0)
				dispatch(`PointerMoveUp`, Math.abs(up))
			else
				dispatch(`PointerMoveDown`, Math.abs(down))
		}

		this.movementX = 0
		this.movementY = 0
	}
}

