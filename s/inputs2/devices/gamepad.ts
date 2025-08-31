
import {tmax} from "../utils/tmax.js"
import {Pad} from "../../utils/gamepads.js"
import {SamplerDevice} from "./infra/sampler.js"
import {splitAxis} from "../../utils/split-axis.js"

const gamepadButtonCodes = [
	"gamepad.a",
	"gamepad.b",
	"gamepad.x",
	"gamepad.y",
	"gamepad.bumper.left",
	"gamepad.bumper.right",
	"gamepad.trigger.left",
	"gamepad.trigger.right",
	"gamepad.alpha",
	"gamepad.beta",
	"gamepad.stick.left.click",
	"gamepad.stick.right.click",
	"gamepad.up",
	"gamepad.down",
	"gamepad.left",
	"gamepad.right",
	"gamepad.gamma",
]

export class GamepadDevice extends SamplerDevice {
	constructor(public pad: Pad) {
		super()
	}

	takeSamples() {
		const {gamepad} = this.pad
		this.#pollButtons(gamepad)
		this.#pollSticks(gamepad)
		return super.takeSamples()
	}

	#pollButtons(gamepad: Gamepad) {
		let anyButtonValue = 0

		const recordAny = (value: number) => {
			anyButtonValue = tmax([anyButtonValue, value])
		}

		for (const [index, code] of gamepadButtonCodes.entries()) {
			const value = gamepad.buttons.at(index)?.value ?? 0
			recordAny(value)
			this.setSample(code, value)
		}

		this.setSample("gamepad.any", anyButtonValue)
	}

	#pollSticks(gamepad: Gamepad) {
		const [leftY, leftX, rightY, rightX] = gamepad.axes

		const [leftUp, leftDown] = splitAxis(leftX)
		const [leftLeft, leftRight] = splitAxis(leftY)
		this.setSample("gamepad.stick.left.up", leftUp)
		this.setSample("gamepad.stick.left.down", leftDown)
		this.setSample("gamepad.stick.left.left", leftLeft)
		this.setSample("gamepad.stick.left.right", leftRight)

		const [rightUp, rightDown] = splitAxis(rightX)
		const [rightLeft, rightRight] = splitAxis(rightY)
		this.setSample("gamepad.stick.right.up", rightUp)
		this.setSample("gamepad.stick.right.down", rightDown)
		this.setSample("gamepad.stick.right.left", rightLeft)
		this.setSample("gamepad.stick.right.right", rightRight)
	}
}

