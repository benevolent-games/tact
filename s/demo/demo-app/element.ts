
import {html} from "lit"
import {shadowElement, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import {Hub} from "../../hub/hub.js"
import {Port} from "../../hub/port.js"
import {asBindings} from "../../core/types.js"
import {Devices} from "../../device/devices.js"
import {Controller} from "../../hub/controller.js"
import {PointerDevice} from "../../device/pointer.js"
import {GamepadDevice} from "../../device/gamepad.js"
import {KeyboardDevice} from "../../device/keyboard.js"
import {ControlsView} from "../../ui/views/controls/view.js"
import {setupConfigurator} from "../../ui/setup-configurator.js"

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

const {configurator} = await setupConfigurator({
	stockProfiles: [
		{id: "93f54a1ee99cecfec4aad62502dfce7e", label: "standard", bindings},
	],
})

configurator.registerInput("279cf5b7c4a5e240181699dca3a33250", primaryController.setBindings)

hub.autoGamepads(bindings, controller => {
	const {device, setBindings} = controller
	port.add(controller)
	return configurator.registerInput(device.gamepad.id, setBindings)
})

export class DemoApp extends shadowElement(() => {
	useCss(styleCss)

	const allControllers = [hub.unassigned, ...hub.ports].flatMap(port => port.array())

	return html`
		<div class=plate>
			${ControlsView(hub, configurator)}

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

