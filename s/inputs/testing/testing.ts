
import {Inputs} from "../inputs.js"
import {asBindings} from "../types.js"
import {Device} from "../parts/device.js"
import {Sampler} from "../utils/sampler.js"
import {Seating} from "../seats/seating.js"
import {seatedBindings} from "../seats/bindings.js"

export function testFrame(f: number) {
	return f * (1000 / 60)
}

export function testBindings() {
	return asBindings({
		basic: {
			jump: [{lenses: [{code: "Space"}]}],
			shoot: [{lenses: [{code: "LMB"}]}],
		},
	})
}

export class TestDevice extends Device {
	sampler = new Sampler()
	samples() {
		return this.sampler.samples()
	}
}

export function testSetupAlpha() {
	const device = new TestDevice()
	const inputs = new Inputs(testBindings())
		.enableModes("basic")
		.attachDevices(device)
	return {device, inputs}
}

export function testSetupBravo() {
	const seat = () => new Inputs(seatedBindings(testBindings()))
		.enableModes("meta", "basic")
	const seating = new Seating([seat(), seat(), seat(), seat()])
	return {seating}
}

