
import {html} from "lit"
import {shadowElement, useCss} from "@e280/sly"

import {Hub} from "../../hub/hub.js"
import styleCss from "./style.css.js"
import {Port} from "../../hub/port.js"
import {asBindings} from "../../core/types.js"
import {Devices} from "../../device/devices.js"
import {Controller} from "../../hub/controller.js"
import {setupDirector} from "../../ui/director.js"
import {DeckView} from "../../ui/views/deck/view.js"
import {PointerDevice} from "../../device/pointer.js"
import {GamepadDevice} from "../../device/gamepad.js"
import {KeyboardDevice} from "../../device/keyboard.js"
import {onGamepadController} from "../../hub/on-gamepad-controller.js"

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

const primaryController = new Controller(bindings, new Devices(
	new KeyboardDevice(),
	new PointerDevice(),
))

const port = new Port([primaryController])
const hub = new Hub(port)

const {director} = await setupDirector({
	stockProfiles: [
		{id: "standard", label: "standard", bindings},
	],
})

director.registerController("primary", primaryController)

onGamepadController(bindings, controller => {
	port.add(controller)
	const unregister = director.registerController(controller.device.gamepad.id, controller)
	return () => {
		unregister()
		hub.forget(controller)
	}
})

export class DemoApp extends shadowElement(() => {
	useCss(styleCss)

	const allControllers = [hub.unassigned, ...hub.ports].flatMap(port => port.array())

	return html`
		<div class=plate>
			${DeckView(hub, director)}

			<hr/>

			<ul>
				${allControllers.map(controller => {
					const {device} = controller
					if (device instanceof GamepadDevice) {
						const gamepad = device.pad.gamepad
						return html`
							<li>
								<span>${gamepad.id}</span>
								<span>${gamepad.index}</span>
								<span>${gamepad.mapping}</span>
							</li>
						`
					}
					return html`
						<li>
							unknown device
						</li>
					`
				})}
			</ul>
		</div>
	`
}) {}

