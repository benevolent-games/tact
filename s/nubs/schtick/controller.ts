
import {Vec2} from "@benev/math"
import {derived, signal} from "@e280/strata"
import {splitVector} from "../../utils/split-axis.js"
import {Sample} from "../../core/controllers/types.js"
import {Controller} from "../../core/controllers/controller.js"

export class SchtickController extends Controller {
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

