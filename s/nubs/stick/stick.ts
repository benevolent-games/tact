
import {Vec2} from "@benev/math"
import {signal} from "@e280/strata"
import {splitAxis} from "../../utils/split-axis.js"

export class Stick {
	vector = signal(Vec2.zero())

	breakdown() {
		const {x, y} = this.vector.get()
		const [down, up] = splitAxis(y)
		const [left, right] = splitAxis(x)
		return {up, down, left, right}
	}
}

