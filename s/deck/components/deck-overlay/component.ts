
import {html} from "lit"
import {cssReset, view} from "@e280/sly"
import {Deck} from "../../deck.js"
import styleCss from "./style.css.js"
import {DeckComponent} from "../framework.js"
import {Device} from "../../../core/devices/device.js"

export class DeckOverlay extends (
	view(use => (deck: Deck<any>) => {
		use.css(cssReset, styleCss)
		use.attrs.string.deck = "overlay"
		const {hub, deviceSkins, overlayVisibility: {$visible, $showLabels}} = deck

		function renderDevice(device: Device) {
			const skin = deviceSkins.get(device)
			const style = `--color: ${skin.color};`
			const next = () => hub.shimmy(device, 1)
			const previous = () => hub.shimmy(device, -1)
			return html`
				<div class=device style="${style}">
					<div class="primary row">
						<button @click="${previous}">&lt;</button>
						<div class=icon>${skin.icon}</div>
						<button @click="${next}">&gt;</button>
					</div>

					${$showLabels() ? html`
						<div class="secondary row">
							<div class=label>${skin.label}</div>
						</div>
					` : null}
				</div>
			`
		}

		return html`
			<div class=portlist ?data-active="${$visible()}">
				${hub.ports.map((port, index) => html`
					<div class=port>
						<header>P${index + 1}</header>
						${port.devices.array().map(renderDevice)}
					</div>
				`)}
			</div>
		`
	})
	.component(DeckComponent)
	.props(el => [el.deck])
) {}

