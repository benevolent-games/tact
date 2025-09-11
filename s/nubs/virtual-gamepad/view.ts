
import {html} from "lit"
import {view} from "@e280/sly"
import {ev, MapG} from "@e280/stz"

import stylesCss from "./styles.css.js"

import {NubStick} from "../stick/view.js"
import {GamepadInputs} from "./utils/gamepad-inputs.js"
import {touchTracking} from "./utils/touch-tracking.js"
import {VpadDevice} from "../../core/devices/standard/vpad.js"
import {preventDefaultTouchShenanigans} from "./utils/prevent-default-touch-shenanigans.js"

export const VirtualGamepad = view(use => (device: VpadDevice) => {
	use.name("virtual-gamepad")
	use.css(stylesCss)

	const buttons = use.once(() => new Set<HTMLButtonElement>())
	const codes = use.once(() => new MapG<HTMLButtonElement, keyof GamepadInputs>())

	use.rendered.then(() => {
		const elements = Array.from(
			use.shadow.querySelectorAll<HTMLButtonElement>("button[x-code]")
		)
		for (const button of elements) {
			const code = button.getAttribute("x-code")
			if (code) {
				buttons.add(button)
				codes.set(button, code as keyof GamepadInputs)
			}
		}
	})

	use.mount(() => preventDefaultTouchShenanigans())

	use.mount(() => touchTracking({
		target: use.shadow,
		buttons,
		touchdown: button => {
			const code = codes.require(button)
			device.setSample(code, 1)
		},
		touchup: button => {
			const code = codes.require(button)
			device.setSample(code, 0)
		},
	}))

	use.mount(() => ev(use.shadow, {
		contextmenu: (e: Event) => e.preventDefault(),
	}))

	function button(code: string, label: string) {
		return html`
			<button x-code="${code}">${label}</button>
		`
	}

	function renderDPad() {
		return html`
			<div class=pad>
				<div>
					${button("gamepad.left", "w")}
				</div>
				<div>
					${button("gamepad.up", "n")}
					${button("gamepad.down", "s")}
				</div>
				<div>
					${button("gamepad.right", "e")}
				</div>
			</div>
		`
	}

	function renderButtonPad() {
		return html`
			<div class=pad>
				<div>
					${button("gamepad.x", "x")}
				</div>
				<div>
					${button("gamepad.y", "y")}
					${button("gamepad.a", "a")}
				</div>
				<div>
					${button("gamepad.b", "b")}
				</div>
			</div>
		`
	}

	function renderLeftShoulder() {
		return html`
			<div class=shoulder>
				${button("gamepad.trigger.left", "lt")}
				${button("gamepad.bumper.left", "lb")}
				${button("gamepad.stick.left.click", "lc")}
			</div>
		`
	}

	function renderRightShoulder() {
		return html`
			<div class=shoulder>
				${button("gamepad.trigger.right", "rt")}
				${button("gamepad.bumper.right", "rb")}
				${button("gamepad.stick.right.click", "rc")}
			</div>
		`
	}

	return html`
		<div class=upper>
			${button("gamepad.alpha", "alpha")}
			${button("gamepad.beta", "beta")}
			${button("gamepad.gamma", "gamma")}
		</div>

		<div class=lower>
			<div class="left side">
				${renderLeftShoulder()}
				${renderDPad()}
				${NubStick.props(device.stickLeft)
					.attr("class", "stick")
					.render}
			</div>

			<div class="right side">
				${renderRightShoulder()}
				${renderButtonPad()}
				${NubStick.props(device.stickRight)
					.attr("class", "stick")
					.render}
			</div>
		</div>
	`
})

