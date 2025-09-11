
import {Vec2} from "@benev/math"
import {derived, signal} from "@e280/strata"
import {Sample} from "../types.js"
import {Device} from "../device.js"
import {splitVector} from "../../../utils/split-axis.js"

export class SchtickDevice extends Device {
	$vector = signal(Vec2.zero())
	$breakdown = derived(() => splitVector(this.$vector.get()))

	constructor(public channel = "stick") {
		super()
	}

	takeSamples() {
		const {channel} = this
		const {up, down, left, right} = this.$breakdown.get()
		return [
			[`${channel}.up`, up],
			[`${channel}.down`, down],
			[`${channel}.left`, left],
			[`${channel}.right`, right],
		] as Sample[]
	}
}

