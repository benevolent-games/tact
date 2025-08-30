
import {Stick} from "../nubs/stick/stick.js"
import {SamplerDevice} from "../inputs/parts/device.js"

export class VirtualGamepadDevice extends SamplerDevice {
	stickLeft = new Stick()
	stickRight = new Stick()

	takeSamples() {
		const left = this.stickLeft.breakdown()
		this.setSample("g.stick.left.up", left.up)
		this.setSample("g.stick.left.down", left.down)
		this.setSample("g.stick.left.left", left.left)
		this.setSample("g.stick.left.right", left.right)

		const right = this.stickRight.breakdown()
		this.setSample("g.stick.right.up", right.up)
		this.setSample("g.stick.right.down", right.down)
		this.setSample("g.stick.right.left", right.left)
		this.setSample("g.stick.right.right", right.right)

		return super.takeSamples()
	}
}

