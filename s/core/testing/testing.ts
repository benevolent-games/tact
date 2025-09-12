
import {Hub} from "../hub/hub.js"
import {Port} from "../hub/port.js"
import {Device} from "../devices/device.js"
import {asBindings} from "../bindings/types.js"
import {Resolver} from "../bindings/resolver.js"
import {SampleMap} from "../bindings/sample-map.js"
import {SamplerDevice} from "../devices/infra/sampler.js"

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

export function testPlug<C extends Device>(hub: Hub<any>, device: C) {
	hub.plug(device)
	return device
}

export function testSetupAlpha() {
	const time = new TestTime()
	const device = new SamplerDevice()
	const resolver = new Resolver(testBindings())
	const modes = new Set(Object.keys(resolver.bindings))
	const resolve = () => resolver.resolve(
		time.now,
		modes as any,
		new SampleMap(device.getSamples())
	)
	return {device, resolver, resolve, time}
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

