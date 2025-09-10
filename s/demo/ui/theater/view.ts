
import {html} from "lit"
import {view} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {VirtualDeviceView} from "../devices/virtual/view.js"
import {KeyboardDeviceView} from "../devices/keyboard/view.js"
import {Device, KeyboardDevice, VirtualDevice} from "../../game/parts/devices.js"

export const Theater = view(use => (game: Game) => {
	use.css(styles)
	use.mount(() => game.loop(60))
	use.mount(() => game.deck.hub.on(use.render))

	const addVirtual = () => game.plug(new VirtualDevice(game.deck.hub))

	function renderDevice(device: Device) {
		return html`
			<div class=device>
				<h4 class=id>${device.id.slice(0, 8)}</h4>
				${(() => {
					if (device instanceof KeyboardDevice)
						return KeyboardDeviceView(device)

					else if (device instanceof VirtualDevice)
						return VirtualDeviceView(game.deck.hub, device)
				})()}
			</div>
		`
	}

	return html`
		${game.renderer.canvas}

		<div class=ports>
			${[...game.logic.players].map((player, index) => html`
				<div style="--color: ${player.agent.color};">
					<h3>p${index + 1}</h3>
					${repeat(
						player.port.controllers.array() as Device[],
						d => d.id,
						renderDevice,
					)}
				</div>
			`)}
		</div>

		<div>
			lol
			<button @click="${addVirtual}">add virtual</button>
		</div>
	`
})

