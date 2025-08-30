//
// import {html} from "lit"
// import {view} from "@e280/sly"
// import {ev, MapG} from "@e280/stz"
//
// import stylesCss from "./styles.css.js"
//
// import {NubStick} from "../nubs/stick/view.js"
// import {VirtualGamepadDevice} from "./device.js"
// import {GamepadInputs} from "./utils/gamepad-inputs.js"
// import {touchTracking} from "./utils/touch-tracking.js"
// import {preventDefaultTouchShenanigans} from "./utils/prevent-default-touch-shenanigans.js"
//
// export const VirtualGamepad = view(use => (device: VirtualGamepadDevice) => {
// 	use.name("virtual-gamepad")
// 	use.css(stylesCss)
//
// 	const buttons = use.once(() => new Set<HTMLButtonElement>())
// 	const codes = use.once(() => new MapG<HTMLButtonElement, keyof GamepadInputs>())
//
// 	use.rendered.then(() => {
// 		const elements = Array.from(
// 			use.shadow.querySelectorAll<HTMLButtonElement>("button[x-code]")
// 		)
// 		for (const button of elements) {
// 			const code = button.getAttribute("x-code")
// 			if (code) {
// 				buttons.add(button)
// 				codes.set(button, code as keyof GamepadInputs)
// 			}
// 		}
// 	})
//
// 	use.mount(() => preventDefaultTouchShenanigans())
//
// 	use.mount(() => touchTracking({
// 		target: use.shadow,
// 		buttons,
// 		touchdown: button => {
// 			const code = codes.require(button)
// 			device.virtualInputs[code] = 1
// 		},
// 		touchup: button => {
// 			const code = codes.require(button)
// 			device.virtualInputs[code] = 0
// 		},
// 	}))
//
// 	use.mount(() => ev(use.shadow, {
// 		contextmenu: (e: Event) => e.preventDefault(),
// 	}))
//
// 	function button(code: string, label: string) {
// 		return html`
// 			<button x-code="${code}">${label}</button>
// 		`
// 	}
//
// 	function renderDPad() {
// 		return html`
// 			<div class=pad>
// 				<div>
// 					${button("g.left", "w")}
// 				</div>
// 				<div>
// 					${button("g.up", "n")}
// 					${button("g.down", "s")}
// 				</div>
// 				<div>
// 					${button("g.right", "e")}
// 				</div>
// 			</div>
// 		`
// 	}
//
// 	function renderButtonPad() {
// 		return html`
// 			<div class=pad>
// 				<div>
// 					${button("g.x", "x")}
// 				</div>
// 				<div>
// 					${button("g.y", "y")}
// 					${button("g.a", "a")}
// 				</div>
// 				<div>
// 					${button("g.b", "b")}
// 				</div>
// 			</div>
// 		`
// 	}
//
// 	function renderLeftShoulder() {
// 		return html`
// 			<div class=shoulder>
// 				${button("g.trigger.left", "lt")}
// 				${button("g.bumper.left", "lb")}
// 				${button("g.stick.left.click", "lc")}
// 			</div>
// 		`
// 	}
//
// 	function renderRightShoulder() {
// 		return html`
// 			<div class=shoulder>
// 				${button("g.trigger.right", "rt")}
// 				${button("g.bumper.right", "rb")}
// 				${button("g.stick.right.click", "rc")}
// 			</div>
// 		`
// 	}
//
// 	return html`
// 		<div class=upper>
// 			${button("g.alpha", "alpha")}
// 			${button("g.beta", "beta")}
// 			${button("g.gamma", "gamma")}
// 		</div>
//
// 		<div class=lower>
// 			<div class="left side">
// 				${renderLeftShoulder()}
// 				${renderDPad()}
// 				${NubStick
// 					.attr("class", "stick")
// 					.props(device.stickLeft)}
// 			</div>
//
// 			<div class="right side">
// 				${renderRightShoulder()}
// 				${renderButtonPad()}
// 				${NubStick
// 					.attr("class", "stick")
// 					.props(device.stickRight)}
// 			</div>
// 		</div>
// 	`
// })
//
