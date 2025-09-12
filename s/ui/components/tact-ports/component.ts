
import {html} from "lit"
import {BaseElement, cssReset, view} from "@e280/sly"
import styleCss from "./style.css.js"
import {Hub} from "../../../core/hub/hub.js"
import {autohiding} from "./parts/auto-hiding.js"
import {Device} from "../../../core/devices/device.js"
import {DeviceSkins} from "../../commons/device-skins/device-skin.js"

export type TactPortsOptions = {
	hub: Hub<any>
	autohide?: {stickyTime: number}
	deviceSkins?: DeviceSkins
}

export class TactPorts extends (view(use => ({
		hub,
		autohide,
		deviceSkins = new DeviceSkins(),
	}: TactPortsOptions) => {

	use.css(cssReset, styleCss)
	use.attrs.string.tact = "ports"

	const $active = use.signal(false)
	use.mount(autohiding(autohide, hub, $active))

	function renderDevice(device: Device) {
		const skin = deviceSkins.get(device)
		const style = `--color: ${skin.color};`
		const next = () => hub.shimmy(device, 1)
		const previous = () => hub.shimmy(device, -1)
		return html`
			<div class=device style="${style}">
				<button @click="${previous}">&lt;</button>
				<div class=icon>${skin.icon}</div>
				<div class=label>${skin.label}</div>
				<button @click="${next}">&gt;</button>
			</div>
		`
	}

	return html`
		<div class=portlist ?data-active="${$active()}">
			${hub.ports.map((port, index) => html`
				<div class=port>
					<header>Port ${index + 1}</header>
					${port.devices.array().map(renderDevice)}
				</div>
			`)}
		</div>
	`
})
.component(class extends BaseElement {
	options!: TactPortsOptions
})
.props(el => [el.options])) {}

