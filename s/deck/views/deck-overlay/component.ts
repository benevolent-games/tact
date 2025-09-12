
import {html} from "lit"
import {cssReset} from "@e280/sly"
import {Deck} from "../../deck.js"
import styleCss from "./style.css.js"
import {deckView} from "../framework.js"
import {Device} from "../../../core/devices/device.js"

export const DeckOverlay = deckView(deck => use => {
	use.css(cssReset, styleCss)
	use.attrs.string.deck = "overlay"

	const {hub, deviceSkins, overlayVisibility: {$visible}} = deck

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
		<div class=portlist ?data-active="${$visible()}">
			${hub.ports.map((port, index) => html`
				<div class=port>
					<header>Port ${index + 1}</header>
					${port.devices.array().map(renderDevice)}
				</div>
			`)}
		</div>
	`

})

