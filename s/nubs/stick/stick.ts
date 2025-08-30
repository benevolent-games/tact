
import {Vec2} from "@benev/math"
import {signal} from "@e280/strata"
import {Disposable} from "@e280/stz"
import {splitAxis} from "../../utils/split-axis.js"
import {SamplerDevice} from "../../inputs/parts/device.js"

export class Stick extends SamplerDevice implements Disposable {
	vector = signal(Vec2.zero())
	dispose: () => void

	constructor(public channel = "stick") {
		super()
		this.dispose = this.vector.on(() => {
			const {up, down, left, right} = this.breakdown()
			this.setSample(`${channel}.up`, up)
			this.setSample(`${channel}.down`, down)
			this.setSample(`${channel}.left`, left)
			this.setSample(`${channel}.right`, right)
		})
	}

	breakdown() {
		const {x, y} = this.vector.get()
		const [down, up] = splitAxis(y)
		const [left, right] = splitAxis(x)
		return {up, down, left, right}
	}
}

