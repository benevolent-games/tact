
import {$, view} from "@e280/sly"
import {NubStick} from "../nubs/stick/view.js"
import {StickController} from "../nubs/stick/controller.js"

$.register({
	TactDemo: view.component(use => {
		const stick = use.once(() => new StickController())
		return NubStick(stick)
	}),
})

console.log("tact")

