
import {Hub} from "../hub/hub.js"
import {Port} from "../hub/port.js"
import {Device} from "../devices/device.js"
import {Resolver} from "../bindings/resolver.js"
import {SampleMap} from "../bindings/sample-map.js"
import {asBindings, Code} from "../bindings/types.js"
import {SamplerDevice} from "../devices/infra/sampler.js"

export class TestClock {
	time = 0

	set frame(frame: number) {
		this.time = frame * (1000 / 60)
	}
}

export function testBindings() {
	return asBindings({
		basic: {
			jump: "Space",
			shoot: "pointer.button.left",
			grenade: <Code>["code", "KeyG", {timing: ["hold", 200]}]
		},
	})
}

export function testPlug<C extends Device>(hub: Hub<any>, device: C) {
	hub.plug(device)
	return device
}

export function testSetupAlpha() {
	const clock = new TestClock()
	const device = new SamplerDevice()
	const resolver = new Resolver(testBindings())
	const modes = new Set(Object.keys(resolver.bindings))
	const actions = resolver.actions
	const resolve = () => resolver.resolve(
		clock.time,
		modes as any,
		new SampleMap(device.samples())
	)
	return {device, resolver, resolve, clock, actions}
}

export function testSetupBravo() {
	const clock = new TestClock()
	const port = () => {
		const port = new Port(testBindings())
		port.modes.adds("basic")
		return port
	}
	const hub = new Hub([port(), port(), port(), port()])
	return {hub, clock}
}

