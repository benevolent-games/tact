//
// import {sub} from "@e280/stz"
// import {Sample} from "../types.js"
// import {Device} from "../parts/device.js"
// import {Sampler} from "../utils/sampler.js"
// import {isPressed} from "../utils/is-pressed.js"
// import {splitAxis} from "../utils/split-axis.js"
// import {applyDeadzone} from "../utils/apply-deadzone.js"
// import {GamepadTracker} from "../utils/gamepad-tracker.js"
//
// export class GamepadDevice extends Device {
// 	on = sub<Sample>()
// 	deadzone = 0.2
// 	tracker = new GamepadTracker()
// 	dispose = () => this.tracker.dispose()
// 	#sampler = new Sampler()
//
// 	dispatch(code: string, value: number) {
// 		this.on.pub(code, value)
// 	}
//
// 	poll() {
// 		let anyButtonValue = 0
// 		let anyButtonPressed = false
//
// 		const dispatch = (code: string, input: number) => {
// 			anyButtonPressed ||= isPressed(input)
// 			this.dispatch(code, input)
// 		}
//
// 		for (const gamepad of this.tracker.gamepads) {
// 			gamepadButtonCodes.forEach((code, index) => {
// 				const value = gamepad.buttons.at(index)?.value ?? 0
// 				anyButtonValue += value
// 				anyButtonPressed ||= isPressed(value)
// 				dispatch(code, value)
// 			})
//
// 			const [leftY, leftX, rightY, rightX] = gamepad.axes
//
// 			const [leftUp, leftDown] = splitAxis(leftX)
// 			const [leftLeft, leftRight] = splitAxis(leftY)
// 			dispatch("pad.stick.left.up", applyDeadzone(leftUp, deadzone))
// 			dispatch("pad.stick.left.down", applyDeadzone(leftDown, deadzone))
// 			dispatch("pad.stick.left.left", applyDeadzone(leftLeft, deadzone))
// 			dispatch("pad.stick.left.right", applyDeadzone(leftRight, deadzone))
//
// 			const [rightUp, rightDown] = splitAxis(rightX)
// 			const [rightLeft, rightRight] = splitAxis(rightY)
// 			dispatch("pad.stick.right.up", applyDeadzone(rightUp, deadzone))
// 			dispatch("pad.stick.right.down", applyDeadzone(rightDown, deadzone))
// 			dispatch("pad.stick.right.left", applyDeadzone(rightLeft, deadzone))
// 			dispatch("pad.stick.right.right", applyDeadzone(rightRight, deadzone))
// 		}
//
// 		this.anyButton.set(anyButtonValue, anyButtonPressed)
// 	}
// }
//
// const gamepadButtonCodes = [
// 	"pad.a",
// 	"pad.b",
// 	"pad.x",
// 	"pad.y",
// 	"pad.bumper.left",
// 	"pad.bumper.right",
// 	"pad.trigger.left",
// 	"pad.trigger.right",
// 	"pad.alpha",
// 	"pad.beta",
// 	"pad.stick.left.click",
// 	"pad.stick.right.click",
// 	"pad.up",
// 	"pad.down",
// 	"pad.left",
// 	"pad.right",
// 	"pad.gamma",
// ]
//
