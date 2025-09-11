
import {html} from "lit"
import {view} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {Device} from "../../../core/devices/device.js"
import {VirtualDevice} from "../../game/parts/virtual-device.js"
import {GamepadDeviceView} from "../devices/gamepad/view.js"
import {VirtualDeviceView} from "../devices/virtual/view.js"
import {PrimaryDeviceView} from "../devices/primary/view.js"
import {GamepadDevice} from "../../../core/devices/standard/gamepad.js"
import {PrimaryDevice} from "../../../core/devices/standard/primary.js"

export const Theater = view(use => (game: Game) => {
	use.css(styles)
	use.mount(() => game.loop(60))
	use.mount(() => game.deck.hub.on(use.render))

	const addVirtual = () => game.plug(new VirtualDevice(game.deck.hub))

	function renderDevice(device: Device) {
		if (device instanceof PrimaryDevice)
			return PrimaryDeviceView(device)
		else if (device instanceof VirtualDevice)
			return VirtualDeviceView(game.deck.hub, device)
		else if (device instanceof GamepadDevice)
			return GamepadDeviceView(device)
	}

	return html`
		${game.renderer.canvas}

		<div class=ports>
			${[...game.logic.players].map((player, index) => html`
				<div
					class=port
					?data-active="${player.port.devices.size > 0}"
					style="--color: ${player.agent.color};">

					<header>port ${index + 1}</header>

					${repeat(
						player.port.devices.array() as Device[],
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

