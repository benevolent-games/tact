
import {html} from "lit"
import {cssReset, view} from "@e280/sly"
import {repeat} from "lit/directives/repeat.js"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {VirtualDeviceView} from "./virtual/view.js"
import {VirtualDevice} from "../../game/parts/virtual-device.js"
import {TactPorts} from "../../../ui/components/tact-ports/component.js"

export const Theater = view(use => (game: Game) => {
	use.css(cssReset, styles)
	use.mount(() => game.loop(60))
	use.mount(() => game.deck.hub.on(use.render))

	const addVirtual = () => game.plug(new VirtualDevice(game.deck.hub))

	const virtualDevices = game.deck.hub.ports
		.flatMap(port => port.devices.array())
		.filter(device => device instanceof VirtualDevice)
		.map(device => ({device, skin: game.deck.deviceSkins.get(device)}))
		.sort((a, b) => a.skin.label < b.skin.label ? -1 : 1)

	return html`
		<div class=surface>
			${game.renderer.canvas}
			${TactPorts.view(game.deck)}
		</div>

		<div class=dlist>
			${repeat(
				virtualDevices,
				d => d.skin.label,
				({device, skin}) => {
					return VirtualDeviceView
						.props(game.deck.hub, device, skin)
						.attr("style", `--color: ${skin.color};`)
						.render()
				},
			)}

			<button @click="${addVirtual}">
				✨ add virtual
			</button>
		</div>
	`
})

