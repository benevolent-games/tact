
import {html} from "lit"
import {view} from "@e280/sly"
import {NubStick} from "../../../nubs/stick/view.js"
import {StickController} from "../../../core/controllers/standard/stick.js"

export class TactDemo extends view.component(use => {
	const stick = use.once(() => new StickController())
	return html`
		${NubStick(stick)}
	`
}) {}

