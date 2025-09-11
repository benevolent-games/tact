
import {html} from "lit"
import {view} from "@e280/sly"
import {Thumbprint} from "@e280/stz"
import {deviceCss} from "./device.css.js"
import {GamepadDevice} from "../../../core/devices/standard/gamepad.js"

export const GamepadDeviceView = view(use => (device: GamepadDevice) => {
	use.styles(deviceCss)
	use.attrs.string.device = "gamepad"

	return html`
		<header>
			<h1>Gamepad</h1>
			<h2>${Thumbprint.sigil.fromHex(device.id)}</h2>
		</header>

		<div class="box row">
			<div class=icon>🎮</div>
		</div>
	`
})

