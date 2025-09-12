
import {Vec2} from "@benev/math"
import {Pad} from "../../../utils/gamepads.js"
import {SamplerDevice} from "../infra/sampler.js"
import {splitVector} from "../../../utils/split-axis.js"
import {circularClamp} from "../../../utils/circular-clamp.js"

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
	range = new Vec2(0.2, 0.9)

	constructor(public pad: Pad) {
		super()
	}

	get gamepad() {
		return this.pad.gamepad
	}

	samples() {
		this.#pollButtons(this.pad.gamepad)
		this.#pollSticks(this.pad.gamepad)
		return super.samples()
	}

	#pollButtons(gamepad: Gamepad) {
		let anyButtonValue = 0

		const recordAny = (value: number) => {
			anyButtonValue = Math.max(anyButtonValue, value)
		}

		for (const [index, code] of gamepadButtonCodes.entries()) {
			const value = gamepad.buttons.at(index)?.value ?? 0
			recordAny(value)
			this.setSample(code, value)
		}

		this.setSample("gamepad.any", anyButtonValue)
	}

	#pollSticks(gamepad: Gamepad) {
		const [leftX, leftY, rightX, rightY] = gamepad.axes

		const stickLeft = splitVector(
			circularClamp(new Vec2(leftX, leftY), this.range)
		)

		const stickRight = splitVector(
			circularClamp(new Vec2(rightX, rightY), this.range)
		)

		this.setSample("gamepad.stick.left.up", stickLeft.up)
		this.setSample("gamepad.stick.left.down", stickLeft.down)
		this.setSample("gamepad.stick.left.left", stickLeft.left)
		this.setSample("gamepad.stick.left.right", stickLeft.right)

		this.setSample("gamepad.stick.right.up", stickRight.up)
		this.setSample("gamepad.stick.right.down", stickRight.down)
		this.setSample("gamepad.stick.right.left", stickRight.left)
		this.setSample("gamepad.stick.right.right", stickRight.right)
	}
}

