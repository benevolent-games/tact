
import {html} from "lit"
import {view} from "@e280/sly"
import {Thumbprint} from "@e280/stz"
import {styleCss} from "./style.css.js"
import {deviceCss} from "../device.css.js"
import {Hub} from "../../../../core/hub/hub.js"
import {NubStick} from "../../../../nubs/stick/view.js"
import {VirtualDevice} from "../../../game/parts/devices.js"

export const VirtualDeviceView = view(use => (hub: Hub<any>, device: VirtualDevice) => {
	use.styles(deviceCss, styleCss)
	use.attrs.string.device = "virtual"

	const unplug = () => hub.unplug(device)

	return html`
		<header>
			<h1>Virtual</h1>
			<h2>${Thumbprint.sigil.fromHex(device.id)}</h2>
		</header>
		<div class="box row">
			${NubStick(device.stick)}
			<div class=column>
				<div class=row>
					<button @click="${device.shimmyPrevious}">👈</button>
					<button @click="${device.shimmyNext}">👉</button>
				</div>
				<button @click="${unplug}">💀</button>
			</div>
		</div>
	`
})

