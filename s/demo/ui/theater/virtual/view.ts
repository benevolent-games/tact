
import {html} from "lit"
import {cssReset, view} from "@e280/sly"
import styleCss from "./style.css.js"
import {Hub} from "../../../../core/hub/hub.js"
import {NubStick} from "../../../../nubs/stick/component.js"
import {VirtualDevice} from "../../../game/parts/virtual-device.js"
import {DeviceSkin} from "../../../../deck/parts/device-skins/device-skin.js"

export const VirtualDeviceView = view(use => (
		hub: Hub<any>,
		device: VirtualDevice,
		_deviceSkin: DeviceSkin,
	) => {

	use.styles(cssReset, styleCss)
	use.attrs.strings.device = "virtual"

	const unplug = () => hub.unplug(device)

	return html`
		<div class=box>
			${NubStick.view(device)}

			<button @click="${device.shimmyPrevious}">👈</button>
			<button @click="${unplug}">💀</button>
			<button @click="${device.shimmyNext}">👉</button>
		</div>
	`
})

