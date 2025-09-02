
import {Hub} from "../hub/hub.js"
import {Port} from "../port/port.js"
import {asBindings} from "../bindings/types.js"
import {Controller} from "../controllers/controller.js"
import {SamplerController} from "../controllers/infra/sampler.js"
import { hubBindings } from "../hub/bindings.js"

export class TestTime {
	frame = 0

	get now() {
		return (this.frame++) * (1000 / 60)
	}
}

export function testBindings() {
	return asBindings({
		basic: {
			jump: "Space",
			shoot: "pointer.button.left",
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
	port.modes.add("basic")
	port.controllers.add(controller)
	return {controller, port, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const port = () => {
		const port = new Port({...testBindings(), ...hubBindings()})
		port.modes.adds(Hub.mode, "basic")
		return port
	}
	const hub = new Hub([port(), port(), port(), port()])
	return {hub, time}
}

