
import {Stick} from "../nubs/stick/stick.js"
import {SamplerDevice} from "../station/devices/infra/sampler.js"

export class VirtualGamepadDevice extends SamplerDevice {
	stickLeft = new Stick()
	stickRight = new Stick()

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

