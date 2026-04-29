
import {html} from "lit"
import {cycle, nap} from "@e280/stz"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {Deck} from "../../hub/deck.js"
import {Port} from "../../hub/port.js"
import {asBindings} from "../../core/types.js"
import {Devices} from "../../device/devices.js"
import {Controller} from "../../hub/controller.js"
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

export class DemoApp extends shadowElement(() => {
	useCss(styleCss)

	const deck = useOnce(() => new Deck(bindings, new Port([
		new Controller(bindings, new Devices(
			new KeyboardDevice(),
			new PointerDevice(),
		))
	])))

	useMount(() => deck.autoGamepads(controller => {
		const [port] = deck.ports
		port.add(controller)
	}))

	useMount(() => cycle(async() => {
		await nap(1000 / 20)
		const [port] = deck.ports
		const activity = port.resolveIntents(Date.now())
		console.log(activity)
	}))

	const allControllers = [deck.unassigned, ...deck.ports].flatMap(port => port.array())

	return html`
		<div class=plate>
			controllers
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

