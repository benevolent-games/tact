
import {html} from "lit"
import {view} from "@e280/sly"
import {Thumbprint} from "@e280/stz"
import {deviceCss} from "./device.css.js"
import {PrimaryDevice} from "../../../core/devices/standard/primary.js"

export const PrimaryDeviceView = view(use => (device: PrimaryDevice) => {
	use.styles(deviceCss)
	use.attrs.string.device = "keyboard"

	return html`
		<header>
			<h1>Keyboard</h1>
			<h2>${Thumbprint.sigil.fromHex(device.id)}</h2>
		</header>

		<div class="box row">
			<div class=icon>⌨️</div>
		</div>
	`
})

