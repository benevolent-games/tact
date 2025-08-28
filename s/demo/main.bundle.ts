
import {$, view} from "@e280/sly"
import {Stick} from "../nubs/stick/stick.js"
import {NubStick} from "../nubs/stick/view.js"

$.register({
	TactDemo: view.component(use => {
		const stick = use.once(() => new Stick())
		return NubStick(stick)
	}),
})

console.log("tact")

