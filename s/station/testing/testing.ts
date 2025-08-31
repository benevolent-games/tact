
import {Station} from "../station.js"
import {asBindings} from "../types.js"
import {Switchboard} from "../switchboard.js"
import {SamplerDevice} from "../devices/infra/sampler.js"
import {switchboardBindings} from "../parts/switchboard-bindings.js"

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
	const station = new Station(testBindings())
		.addModes("basic")
		.addDevices(device)
	return {device, station, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const station = () => new Station(switchboardBindings(testBindings()))
		.addModes("switchboard", "basic")
	const switchboard = new Switchboard([station(), station(), station(), station()])
	return {switchboard, time}
}

