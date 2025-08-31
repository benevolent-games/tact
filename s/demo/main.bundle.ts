
import {$, view} from "@e280/sly"
import {StickDevice} from "../nubs/stick/device.js"
import {NubStick} from "../nubs/stick/view.js"

$.register({
	TactDemo: view.component(use => {
		const stick = use.once(() => new StickDevice())
		return NubStick(stick)
	}),
})

console.log("tact")

