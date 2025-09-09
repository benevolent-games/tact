
import {Science, test, expect} from "@e280/science"
import {SamplerController} from "./controllers/infra/sampler.js"
import {testConnect, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {port, controller, time} = testSetupAlpha()
		{
			controller.setSample("Space", 1)
			const actions = port.resolve(time.now)
			expect(actions.basic.jump.value).is(1)
			expect(actions.basic.shoot.value).is(0)
		}
		{
			controller.setSample("Space", 2)
			controller.setSample("pointer.button.left", 3)
			const actions = port.resolve(time.now)
			expect(actions.basic.jump.value).is(2)
			expect(actions.basic.shoot.value).is(3)
		}
	}),

	"hub": Science.suite({
		"controller inputs work": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testConnect(hub, new SamplerController())
			c1.setSample("Space", 1)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.basic.jump.value).is(1)
			expect(p2.basic.jump.value).is(0)
		}),

		"two controllers playing on separate ports": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testConnect(hub, new SamplerController())
			const c2 = testConnect(hub, new SamplerController())
			c1.setSample("Space", 1)
			c2.setSample("Space", 2)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.basic.jump.value).is(1)
			expect(p2.basic.jump.value).is(2)
		}),

		"controller can shimmy": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testConnect(hub, new SamplerController())
			hub.shimmy(c1, 1)
			c1.setSample("Space", 1)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.basic.jump.value).is(0)
			expect(p2.basic.jump.value).is(1)
		}),

		"two controllers can share a port": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testConnect(hub, new SamplerController())
			const c2 = testConnect(hub, new SamplerController())
			hub.shimmy(c2, -1)
			expect(hub.portByController(c1)).is(hub.portByController(c2))
			{
				c1.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.basic.jump.value).is(1)
				expect(p2.basic.jump.value).is(0)
			}
			{
				c2.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.basic.jump.value).is(1)
				expect(p2.basic.jump.value).is(0)
			}
			{
				c1.setSample("Space", 1)
				c2.setSample("Space", 2)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.basic.jump.value).is(2)
				expect(p2.basic.jump.value).is(0)
			}
			{
				c1.setSample("Space", 2)
				c2.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.basic.jump.value).is(2)
				expect(p2.basic.jump.value).is(0)
			}
		}),
	}),
})

