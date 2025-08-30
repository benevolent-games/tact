//
// import {Stick} from "../nubs/stick/stick.js"
// import {GamepadDevice} from "../_archive/gamepad-device.js"
// import {GamepadInputs, gamepadInputs} from "./utils/gamepad-inputs.js"
//
// export class VirtualGamepadDevice extends GamepadDevice {
// 	stickLeft = new Stick()
// 	stickRight = new Stick()
//
// 	realInputs: GamepadInputs = gamepadInputs()
// 	virtualInputs: GamepadInputs = gamepadInputs()
//
// 	dispatch(code: string, input: number) {
// 		this.realInputs[code as keyof GamepadInputs] = input
// 	}
//
// 	poll() {
// 		const combinedInputs = gamepadInputs()
//
// 		super.poll()
// 		this.#updateStickInputs()
//
// 		for (const [code, input] of Object.entries(this.realInputs))
// 			combinedInputs[code as keyof GamepadInputs] += input
//
// 		for (const [code, input] of Object.entries(this.virtualInputs))
// 			combinedInputs[code as keyof GamepadInputs] += input
//
// 		for (const [code, input] of Object.entries(combinedInputs))
// 			this.onInput.pub(code, input)
// 	}
//
// 	#updateStickInputs() {
// 		const {virtualInputs: inputs} = this
//
// 		const left = this.stickLeft.breakdown()
// 		inputs["g.stick.left.up"] = left.up
// 		inputs["g.stick.left.down"] = left.down
// 		inputs["g.stick.left.left"] = left.left
// 		inputs["g.stick.left.right"] = left.right
//
// 		const right = this.stickRight.breakdown()
// 		inputs["g.stick.right.up"] = right.up
// 		inputs["g.stick.right.down"] = right.down
// 		inputs["g.stick.right.left"] = right.left
// 		inputs["g.stick.right.right"] = right.right
// 	}
//
// 	dispose = () => {}
// }
//
