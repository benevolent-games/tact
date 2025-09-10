
import {css, html} from "lit"
import {view} from "@e280/sly"
import {KeyboardDevice} from "../../../game/parts/devices.js"

export const KeyboardDeviceView = view(use => (_device: KeyboardDevice) => {
	use.name("device")
	use.once(() => use.attrs.string.device = "keyboard")
	use.styles(css`div { font-size: 3em; }`)

	return html`<div>⌨️</div>`
})

