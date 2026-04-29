
import {html} from "lit"
import {cssReset, shadow, useCss, useName} from "@e280/sly"
import styleCss from "./style.css.js"
import {Hub} from "../../../../core/hub/hub.js"
import {NubStick} from "../../../../nubs/stick/view.js"
import {VirtualDevice} from "../../../game/parts/virtual-device.js"
import {DeviceSkin} from "../../../../deck/parts/device-skins/device-skin.js"

export const VirtualDeviceView = shadow((
	hub: Hub<any>,
	device: VirtualDevice,
	_deviceSkin: DeviceSkin,
) => {
	useCss(cssReset, styleCss)
	useName("virtual-device")

	const unplug = () => hub.unplug(device)

	return html`
		<div class=box>
			${NubStick(device)}

			<button @click="${device.shimmyPrevious}">👈</button>
			<button @click="${unplug}">💀</button>
			<button @click="${device.shimmyNext}">👉</button>
		</div>
	`
})
