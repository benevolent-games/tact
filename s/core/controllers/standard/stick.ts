
import {Vec2} from "@benev/math"
import {signal} from "@e280/strata"
import {Sample} from "../types.js"
import {Controller} from "../controller.js"
import {splitAxis} from "../../../utils/split-axis.js"

export class StickController extends Controller {
	vector = signal(Vec2.zero())

	constructor(public channel = "stick") {
		super()
	}

	takeSamples() {
		const {channel} = this
		const {up, down, left, right} = this.breakdown()
		return [
			[`${channel}.up`, up],
			[`${channel}.down`, down],
			[`${channel}.left`, left],
			[`${channel}.right`, right],
		] as Sample[]
	}

	breakdown() {
		const {x, y} = this.vector.get()
		const [down, up] = splitAxis(y)
		const [left, right] = splitAxis(x)
		return {up, down, left, right}
	}
}

