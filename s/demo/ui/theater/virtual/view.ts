
import {html} from "lit"
import {cssReset, view} from "@e280/sly"
import styleCss from "./style.css.js"
import {Hub} from "../../../../core/hub/hub.js"
import {NubStick} from "../../../../nubs/stick/view.js"
import {VirtualDevice} from "../../../game/parts/virtual-device.js"
import {DeviceSkin} from "../../../../deck/parts/device-skins/device-skin.js"

export const VirtualDeviceView = view(use => (
		hub: Hub<any>,
		device: VirtualDevice,
		deviceSkin: DeviceSkin,
	) => {

	use.styles(cssReset, styleCss)
	use.attrs.string.device = "virtual"

	const unplug = () => hub.unplug(device)

	return html`
		<div class=box>
			${NubStick.view(device)}

			<div class=label>${deviceSkin.label}</div>

			<button @click="${device.shimmyPrevious}">👈</button>
			<button @click="${unplug}">💀</button>
			<button @click="${device.shimmyNext}">👉</button>
		</div>
	`
})

