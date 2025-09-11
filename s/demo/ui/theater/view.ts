
import {html} from "lit"
import {view} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {GamepadDeviceView} from "../devices/gamepad/view.js"
import {VirtualDeviceView} from "../devices/virtual/view.js"
import {CompositeDeviceView} from "../devices/composite/view.js"
import {Controller} from "../../../core/controllers/controller.js"
import {CompositeDevice, VirtualDevice} from "../../game/parts/devices.js"
import {GamepadController} from "../../../core/controllers/standard/gamepad.js"

export const Theater = view(use => (game: Game) => {
	use.css(styles)
	use.mount(() => game.loop(60))
	use.mount(() => game.deck.hub.on(use.render))

	const addVirtual = () => game.plug(new VirtualDevice(game.deck.hub))

	function renderDevice(device: Controller) {
		if (device instanceof CompositeDevice)
			return CompositeDeviceView(device)
		else if (device instanceof VirtualDevice)
			return VirtualDeviceView(game.deck.hub, device)
		else if (device instanceof GamepadController)
			return GamepadDeviceView(device)
	}

	return html`
		${game.renderer.canvas}

		<div class=ports>
			${[...game.logic.players].map((player, index) => html`
				<div
					class=port
					?data-active="${player.port.controllers.size > 0}"
					style="--color: ${player.agent.color};">

					<header>port ${index + 1}</header>

					${repeat(
						player.port.controllers.array() as Controller[],
						d => d.id,
						renderDevice,
					)}
				</div>
			`)}
		</div>

		<div>
			<button @click="${addVirtual}">
				✨ add virtual
			</button>
		</div>
	`
})

