
import {Inputs} from "../inputs.js"
import {asBindings} from "../types.js"
import {Seating} from "../seats/seating.js"
import {SamplerDevice} from "../parts/device.js"
import {seatedBindings} from "../seats/bindings.js"

export class TestTime {
	frame = 0

	get now() {
		return (this.frame++) * (1000 / 60)
	}
}

export function testBindings() {
	return asBindings({
		basic: {
			jump: [{lenses: [{code: "Space"}]}],
			shoot: [{lenses: [{code: "LMB"}]}],
		},
	})
}

export function testSetupAlpha() {
	const time = new TestTime()
	const device = new SamplerDevice()
	const inputs = new Inputs(testBindings())
		.addModes("basic")
		.addDevices(device)
	return {device, inputs, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const seat = () => new Inputs(seatedBindings(testBindings()))
		.addModes("meta", "basic")
	const seating = new Seating([seat(), seat(), seat(), seat()])
	return {seating, time}
}

