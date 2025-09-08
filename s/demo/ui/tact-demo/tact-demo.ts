
import {html} from "lit"
import {view} from "@e280/sly"
import {styles} from "./styles.css.js"
import {NubStick} from "../../../nubs/stick/view.js"
import {StickController} from "../../../core/controllers/standard/stick.js"

export class TactDemo extends view.component(use => {
	use.css(styles)

	const stick = use.once(() => new StickController())
	const canvas = use.once(() => {
		const canvas = document.createElement("canvas")
		canvas.width = 800
		canvas.height = 400
		return canvas
	})

	return html`
		${canvas}
		${NubStick(stick)}
	`
}) {}

