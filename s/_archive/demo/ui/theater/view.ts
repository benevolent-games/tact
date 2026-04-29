
import {html} from "lit"
import {repeat} from "lit/directives/repeat.js"
import {cssReset, shadow, useCss, useMount, useRender} from "@e280/sly"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {VirtualDeviceView} from "./virtual/view.js"
import {VirtualDevice} from "../../game/parts/virtual-device.js"
import {DeckBindings} from "../../../deck/views/bindings/view.js"
import { DeckOverlay } from "../../../deck/views/overlay/view.js"

export const DemoTheater = shadow((game: Game) => {
	useCss(cssReset, styles)
	useMount(() => game.loop(60))
	const render = useRender()
	useMount(() => game.deck.hub.on(render))

	const addVirtual = () => game.plug(new VirtualDevice(game.deck.hub))
	const revealOverlay = () => game.deck.overlayVisibility.bump()

	const virtualDevices = game.deck.hub.ports
		.flatMap(port => port.devices.array())
		.filter(device => device instanceof VirtualDevice)
		.map(device => ({device, skin: game.deck.deviceSkins.get(device)}))
		.sort((a, b) => a.skin.label < b.skin.label ? -1 : 1)

	return html`
		<div class=surface>
			${game.renderer.canvas}
			${DeckOverlay(game.deck)}
		</div>

		<div class=dlist>
			${repeat(
				virtualDevices,
				d => d.skin.label,
				({device, skin}) => VirtualDeviceView.with({
					props: [game.deck.hub, device, skin],
					attrs: {style: `--color: ${skin.color};`},
				}),
			)}

			<button @click="${addVirtual}">
				✨
			</button>

			<button @click="${revealOverlay}">
				👁️
			</button>
		</div>

		${DeckBindings(game.deck)}
	`
})
