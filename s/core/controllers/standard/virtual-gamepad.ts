
import {StickController} from "./stick.js"
import {SamplerController} from "../infra/sampler.js"

export class VirtualGamepadController extends SamplerController {
	stickLeft = new StickController()
	stickRight = new StickController()

	takeSamples() {
		const left = this.stickLeft.breakdown()
		this.setSample("gamepad.stick.left.up", left.up)
		this.setSample("gamepad.stick.left.down", left.down)
		this.setSample("gamepad.stick.left.left", left.left)
		this.setSample("gamepad.stick.left.right", left.right)

		const right = this.stickRight.breakdown()
		this.setSample("gamepad.stick.right.up", right.up)
		this.setSample("gamepad.stick.right.down", right.down)
		this.setSample("gamepad.stick.right.left", right.left)
		this.setSample("gamepad.stick.right.right", right.right)

		return super.takeSamples()
	}
}

