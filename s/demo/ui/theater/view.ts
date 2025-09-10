
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
		if (device instanceof KeyboardDevice)
			return KeyboardDeviceView(device)
		else if (device instanceof VirtualDevice)
			return VirtualDeviceView(game.deck.hub, device)
	}

	return html`
		${game.renderer.canvas}

		<div class=ports>
			${[...game.logic.players].map((player, index) => html`
				<div style="--color: ${player.agent.color};">
					<header>p${index + 1}</header>
					${repeat(
						player.port.controllers.array() as Device[],
						d => d.id,
						renderDevice,
					)}
				</div>
			`)}
		</div>

		<div>
			<button @click="${addVirtual}">✨</button>
		</div>
	`
})

