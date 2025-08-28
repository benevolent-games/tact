
import {Vec2} from "@benev/math"
import {signal} from "@e280/strata"
import {Device} from "../../devices/device.js"
import {splitAxis} from "../../utils/split-axis.js"

export class Stick extends Device {
	vector = signal(Vec2.zero())
	dispose: () => void

	constructor(public channel = "stick") {
		super()
		this.dispose = this.vector.on(() => {
			const {up, down, left, right} = this.breakdown()
			this.onInput.pub(`${channel}.up`, up)
			this.onInput.pub(`${channel}.down`, down)
			this.onInput.pub(`${channel}.left`, left)
			this.onInput.pub(`${channel}.right`, right)
		})
	}

	breakdown() {
		const {x, y} = this.vector.get()
		const [down, up] = splitAxis(y)
		const [left, right] = splitAxis(x)
		return {up, down, left, right}
	}
}

