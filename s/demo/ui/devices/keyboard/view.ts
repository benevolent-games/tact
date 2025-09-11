
import {html} from "lit"
import {view} from "@e280/sly"
import {Thumbprint} from "@e280/stz"
import {styleCss} from "./style.css.js"
import {deviceCss} from "../device.css.js"
import {KeyboardDevice} from "../../../game/parts/devices.js"

export const KeyboardDeviceView = view(use => (device: KeyboardDevice) => {
	use.styles(deviceCss, styleCss)
	use.attrs.string.device = "keyboard"

	return html`
		<header>
			<h1>Keyboard</h1>
			<h2>${Thumbprint.sigil.fromHex(device.id)}</h2>
		</header>
		<div class="box row">
			<div class=icon>⌨️</div>
			<div class=text>wasd</div>
		</div>
	`
})

