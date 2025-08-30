
import {Inputs} from "../inputs.js"
import {asBindings} from "../types.js"
import {Seating} from "../seats/seating.js"
import {SamplerDevice} from "../parts/device.js"
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

export function testSetupAlpha() {
	const device = new SamplerDevice()
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

