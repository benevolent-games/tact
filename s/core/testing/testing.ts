
import {Hub} from "../hub/hub.js"
import {Port} from "../hub/port.js"
import {asBindings} from "../bindings/types.js"
import {Controller} from "../controllers/controller.js"
import {SamplerController} from "../controllers/infra/sampler.js"
import { metaBindings } from "../hub/bindings.js"
import { Resolver } from "../bindings/resolver.js"
import { SampleMap } from "../bindings/sample-map.js"

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
	const resolver = new Resolver(testBindings())
	resolver.modes.add("basic")
	const resolve = () => resolver.resolve(
		time.now,
		new SampleMap(controller.takeSamples()),
	)
	return {controller, resolver, resolve, time}
}

export function testSetupBravo() {
	const time = new TestTime()
	const port = () => {
		const port = new Port(testBindings())
		port.modes.adds("basic")
		return port
	}
	const hub = new Hub([port(), port(), port(), port()])
	return {hub, time}
}

