
import {Content, dom} from "@e280/sly"
import {LocalStore} from "@e280/strata"

import {Deck} from "../ui/deck/deck.js"
import {asBindings} from "../core/types.js"
import {doAsync} from "../utils/do-async.js"
import {Devices} from "../device/devices.js"
import {onPad} from "../device/parts/pad.js"
import {DeckState} from "../ui/deck/types.js"
import {PointerDevice} from "../device/pointer.js"
import {GamepadDevice} from "../device/gamepad.js"
import {setupDemoApp} from "./demo-app/element.js"
import {Controller} from "../ui/deck/controller.js"
import {KeyboardDevice} from "../device/keyboard.js"

const bindings = asBindings({
	play: {
		action: ["or", "Space", "pointer.button.left", "gamepad.button.1"],
		up: ["or", "KeyW", "gamepad.axis.2.pos"],
		down: ["or", "KeyS", "gamepad.axis.2.neg"],
		left: ["or", "KeyA", "gamepad.axis.1.pos"],
		right: ["or", "KeyD", "gamepad.axis.1.neg"],
	},
})

const store = new LocalStore<DeckState>("tactDeck")

const deck = new Deck({
	store,
	stockProfiles: {
		standard: {label: "📜standard", bindings: bindings},
		micro: {label: "🦠micro", bindings: asBindings<typeof bindings>({
			play: {
				action: ["or", "Space", "pointer.button.left", "gamepad.button.1"],
				up: ["or", "KeyW", "gamepad.axis.2.pos"],
				down: ["or", "KeyS", "gamepad.axis.2.neg"],
				left: ["or", "KeyA", "gamepad.axis.1.pos"],
				right: ["or", "KeyD", "gamepad.axis.1.neg"],
			},
		})},
	},
})

await deck.load()
store.onStorageEvent(() => deck.load())

const port = await deck.createPort()
const controller = new Controller(bindings, new Devices(
	new KeyboardDevice(),
	new PointerDevice(),
))

await deck.connectController("primary", controller)
await deck.plug("primary", port)

const labels = new Map<any, Content>()
	.set(controller, "⌨️🖱keyboard+mouse")

onPad(pad => {
	const id = `(${pad.gamepad.index}) ${pad.gamepad.id}`
	const controller = new Controller(bindings, new GamepadDevice(pad))
	labels.set(controller, `🎮${pad.gamepad.id}`)
	doAsync(async() => {
		await deck.connectController(id, controller)
		await deck.plug(id, port)
	})
	return () => deck.disconnectController(id)
})

dom.register({DemoApp: setupDemoApp(deck, {labels})})

