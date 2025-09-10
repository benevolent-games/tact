
import {html} from "lit"
import {view} from "@e280/sly"
import {styles} from "./styles.css.js"
import {Hub} from "../../../../core/hub/hub.js"
import {NubStick} from "../../../../nubs/stick/view.js"
import {VirtualDevice} from "../../../game/parts/devices.js"

export const VirtualDeviceView = view(use => (hub: Hub<any>, device: VirtualDevice) => {
	use.styles(styles)
	use.attrs.string.device = "virtual"

	const ded = () => hub.unplug(device)

	return html`
		<div class=row>
			${NubStick(device.stick)}
			<div class=column>
				<div class=row>
					<button @click="${device.shimmyPrevious}">👈</button>
					<button @click="${device.shimmyNext}">👉</button>
				</div>
				<button @click="${ded}">💀</button>
			</div>
		</div>
	`
})

