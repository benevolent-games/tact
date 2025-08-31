
import {Player} from "../player.js"
import {Seating} from "../seating.js"
import {asBindings} from "../types.js"
import {SamplerDevice} from "../devices/infra/sampler.js"
import {seatedBindings} from "../parts/seated-bindings.js"

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
			shoot: [{lenses: [{code: "mouse.button.left"}]}],
		},
	})
}

export function testSetupAlpha() {
	const time = new TestTime()
	const device = new SamplerDevice()
	const player = new Player(testBindings())
		.addModes("basic")
		.addDevices(device)
	return {device, player, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const player = () => new Player(seatedBindings(testBindings()))
		.addModes("meta", "basic")
	const seating = new Seating([player(), player(), player(), player()])
	return {seating, time}
}

