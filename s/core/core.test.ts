
import {Science, test, expect} from "@e280/science"
import {SamplerController} from "./controllers/infra/sampler.js"
import {testConnect, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {port, controller, time} = testSetupAlpha()
		expect(port.actions.basic.jump.value).is(0)
		expect(port.actions.basic.shoot.value).is(0)
		controller.setSample("Space", 1)
		port.poll(time.now)
		expect(port.actions.basic.jump.value).is(1)
		expect(port.actions.basic.shoot.value).is(0)
		controller.setSample("Space", 2)
		controller.setSample("pointer.button.left", 3)
		port.poll(time.now)
		expect(port.actions.basic.jump.value).is(2)
		expect(port.actions.basic.shoot.value).is(3)
	}),

	"hub": Science.suite({
		"controller inputs work": test(async() => {
			const {hub, time} = testSetupBravo()
			const [s1, s2] = hub.ports
			const d1 = testConnect(hub, new SamplerController())
			expect(s1.actions.basic.jump.value).is(0)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 1)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
		}),

		"two controllers playing on separate ports": test(async() => {
			const {hub, time} = testSetupBravo()
			const [s1, s2] = hub.ports
			const d1 = testConnect(hub, new SamplerController())
			const d2 = testConnect(hub, new SamplerController())
			d1.setSample("Space", 1)
			d2.setSample("Space", 2)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(2)
		}),

		"controller can shimmy": test(async() => {
			const {hub, time} = testSetupBravo()
			const [s1, s2] = hub.ports
			const d1 = testConnect(hub, new SamplerController())
			hub.shimmy(d1, 1)
			d1.setSample("Space", 1)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(0)
			expect(s2.actions.basic.jump.value).is(1)
		}),

		"two controllers can share a port": test(async() => {
			const {hub, time} = testSetupBravo()
			const [s1, s2] = hub.ports
			const d1 = testConnect(hub, new SamplerController())
			const d2 = testConnect(hub, new SamplerController())
			hub.shimmy(d2, -1)
			expect(hub.portByController(d1)).is(hub.portByController(d2))
			d1.setSample("Space", 1)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
			d2.setSample("Space", 1)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 1)
			d2.setSample("Space", 2)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(2)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 2)
			d2.setSample("Space", 1)
			hub.poll(time.now)
			expect(s1.actions.basic.jump.value).is(2)
			expect(s2.actions.basic.jump.value).is(0)
		}),
	}),
})

