
import {dom} from "@e280/sly"
import {LocalStore} from "@e280/strata"

import {Deck} from "../ui/deck/deck.js"
import {asBindings} from "../core/types.js"
import {Devices} from "../device/devices.js"
import {onPad} from "../device/parts/pad.js"
import {DeckState} from "../ui/deck/types.js"
import {PointerDevice} from "../device/pointer.js"
import {GamepadDevice} from "../device/gamepad.js"
import {setupDemoApp} from "./demo-app/element.js"
import {Controller} from "../ui/deck/controller.js"
import {KeyboardDevice} from "../device/keyboard.js"

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

deck.load()
store.onStorageEvent(() => deck.load())

const port = deck.createPort()
const controller = new Controller(bindings, new Devices(
	new KeyboardDevice(),
	new PointerDevice(),
))

deck.connectController("primary", controller, {port, profileId: "standard"})

onPad(pad => {
	const {id} = pad.gamepad
	console.log(id)
	const controller = new Controller(bindings, new GamepadDevice(pad))
	deck.connectController(id, controller, {port, profileId: "standard"})
	return () => deck.disconnectController(id)
})

dom.register({DemoApp: setupDemoApp(deck)})

