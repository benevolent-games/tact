
import {Science, test, expect} from "@e280/science"
import {metaMode} from "./hub/types.js"
import {SamplerDevice} from "./devices/infra/sampler.js"
import {testPlug, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {time, device, resolve} = testSetupAlpha()
		{
			time.frame = 1
			device.setSample("Space", 1)
			const actions = resolve()
			expect(actions.basic.jump.value).is(1)
			expect(actions.basic.shoot.value).is(0)
		}
		{
			time.frame = 2
			device.setSample("Space", 2)
			device.setSample("pointer.button.left", 3)
			const actions = resolve()
			expect(actions.basic.jump.value).is(2)
			expect(actions.basic.shoot.value).is(3)
		}
	}),

	"hub": Science.suite({
		"device inputs work": test(async() => {
			const {hub, time} = testSetupBravo()
			const d1 = testPlug(hub, new SamplerDevice())
			d1.setSample("Space", 1)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.actions.basic.jump.value).is(1)
			expect(p2.actions.basic.jump.value).is(0)
		}),

		"reveal overlay works": test(async() => {
			const {hub, time} = testSetupBravo()
			const d1 = testPlug(hub, new SamplerDevice())
			d1.setSample("Backslash", 1)
			hub.poll(time.now)
			expect(hub.metaPort.actions[metaMode].revealOverlay.value)
				.is(1)
		}),

		"two devices playing on separate ports": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testPlug(hub, new SamplerDevice())
			const c2 = testPlug(hub, new SamplerDevice())
			c1.setSample("Space", 1)
			c2.setSample("Space", 2)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.actions.basic.jump.value).is(1)
			expect(p2.actions.basic.jump.value).is(2)
		}),

		"device can shimmy": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testPlug(hub, new SamplerDevice())
			hub.shimmy(c1, 1)
			c1.setSample("Space", 1)
			const [p1, p2] = hub.poll(time.now)
			expect(p1.actions.basic.jump.value).is(0)
			expect(p2.actions.basic.jump.value).is(1)
		}),

		"two devices can share a port": test(async() => {
			const {hub, time} = testSetupBravo()
			const c1 = testPlug(hub, new SamplerDevice())
			const c2 = testPlug(hub, new SamplerDevice())
			hub.shimmy(c2, -1)
			expect(hub.portByDevice(c1)).is(hub.portByDevice(c2))
			{
				c1.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.actions.basic.jump.value).is(1)
				expect(p2.actions.basic.jump.value).is(0)
			}
			{
				c2.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.actions.basic.jump.value).is(1)
				expect(p2.actions.basic.jump.value).is(0)
			}
			{
				c1.setSample("Space", 1)
				c2.setSample("Space", 2)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.actions.basic.jump.value).is(2)
				expect(p2.actions.basic.jump.value).is(0)
			}
			{
				c1.setSample("Space", 2)
				c2.setSample("Space", 1)
				const [p1, p2] = hub.poll(time.now)
				expect(p1.actions.basic.jump.value).is(2)
				expect(p2.actions.basic.jump.value).is(0)
			}
		}),
	}),
})

