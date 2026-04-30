
import {html} from "lit"
import {LocalStore} from "@e280/strata"
import {shadowElement, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import {Deck} from "../../ui/deck/deck.js"
import {asBindings} from "../../core/types.js"
import {Devices} from "../../device/devices.js"
import {onPad} from "../../device/parts/pad.js"
import {DeckState} from "../../ui/deck/types.js"
import {DeckView} from "../../ui/views/deck/view.js"
import {PointerDevice} from "../../device/pointer.js"
import {GamepadDevice} from "../../device/gamepad.js"
import {KeyboardDevice} from "../../device/keyboard.js"

const bindings = asBindings({
	spectator: {
		action: ["or", "Space", "pointer.button.left", "gamepad.a"],
	},
	robot: {
		up: ["or", "KeyW", "gamepad.stick.left.up"],
		down: ["or", "KeyS", "gamepad.stick.left.down"],
		left: ["or", "KeyA", "gamepad.stick.left.left"],
		right: ["or", "KeyD", "gamepad.stick.left.right"],
		action: ["or", "Space", "pointer.button.left", "gamepad.a"],
	},
})

const store = new LocalStore<DeckState>("tactDeck")

const deck = new Deck({
	store,
	profiles: {
		standard: {label: "standard", bindings},
		micro: {label: "micro", bindings},
	},
})

const port = deck.addPort()

deck.setDevice({
	id: "primary",
	port,
	profileId: "standard",
	device: new Devices(
		new KeyboardDevice(),
		new PointerDevice(),
	),
})

onPad(pad => {
	const {id} = pad.gamepad
	const device = new GamepadDevice(pad)
	deck.setDevice({
		id,
		device,
		port: null,
		profileId: "standard",
	})
	return () => deck.deleteDevice(id)
})

export class DemoApp extends shadowElement(() => {
	useCss(styleCss)

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
}) {}

