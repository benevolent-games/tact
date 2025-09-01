
import {Hub} from "../hub/hub.js"
import {Port} from "../port/port.js"
import {asBindings} from "../bindings/types.js"
import {hubBindings} from "../hub/bindings.js"
import {Controller} from "../controllers/controller.js"
import {SamplerController} from "../controllers/infra/sampler.js"

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
			shoot: [{lenses: [{code: "pointer.button.left"}]}],
		},
	})
}

export function testConnect<C extends Controller>(switchboard: Hub<any>, controller: C) {
	switchboard.plug(controller)
	return controller
}

export function testSetupAlpha() {
	const time = new TestTime()
	const controller = new SamplerController()
	const port = new Port(testBindings())
		.addModes("basic")
		.addControllers(controller)
	return {controller, port, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const port = () => new Port(hubBindings(testBindings()))
		.addModes(Hub.mode, "basic")
	const hub = new Hub([port(), port(), port(), port()])
	return {hub: hub, time}
}

