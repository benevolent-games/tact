
import {Vec2} from "@benev/math"
import {derived, signal} from "@e280/strata"
import {Sample} from "../types.js"
import {Device} from "../device.js"
import {splitVector} from "../../../utils/split-axis.js"

export class StickDevice extends Device {
	$vector = signal(Vec2.zero())
	$breakdown = derived(() => splitVector(this.$vector.get()))

	constructor(public channel = "stick") {
		super()
	}

	;*getSamples() {
		const {channel} = this
		const {up, down, left, right} = this.$breakdown.get()
		yield [`${channel}.up`, up] as Sample
		yield [`${channel}.down`, down] as Sample
		yield [`${channel}.left`, left] as Sample
		yield [`${channel}.right`, right] as Sample
	}
}

