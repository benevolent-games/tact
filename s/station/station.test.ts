
import {Science, test, expect} from "@e280/science"
import {SamplerDevice} from "./devices/infra/sampler.js"
import {testConnect, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {station, device, time} = testSetupAlpha()
		expect(station.actions.basic.jump.value).is(0)
		expect(station.actions.basic.shoot.value).is(0)
		device.setSample("Space", 1)
		station.poll(time.now)
		expect(station.actions.basic.jump.value).is(1)
		expect(station.actions.basic.shoot.value).is(0)
		device.setSample("Space", 2)
		device.setSample("pointer.button.left", 3)
		station.poll(time.now)
		expect(station.actions.basic.jump.value).is(2)
		expect(station.actions.basic.shoot.value).is(3)
	}),

	"switchboard": Science.suite({
		"player1 inputs work": test(async() => {
			const {switchboard, time} = testSetupBravo()
			const [s1, s2] = switchboard.stations
			const d1 = testConnect(switchboard, new SamplerDevice())
			expect(s1.actions.basic.jump.value).is(0)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 1)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
		}),

		"two devices playing on separate stations": test(async() => {
			const {switchboard, time} = testSetupBravo()
			const [s1, s2] = switchboard.stations
			const d1 = testConnect(switchboard, new SamplerDevice())
			const d2 = testConnect(switchboard, new SamplerDevice())
			d1.setSample("Space", 1)
			d2.setSample("Space", 2)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(2)
		}),

		"player can shimmy": test(async() => {
			const {switchboard, time} = testSetupBravo()
			const [s1, s2] = switchboard.stations
			const d1 = testConnect(switchboard, new SamplerDevice())
			switchboard.shimmy(d1, 1)
			d1.setSample("Space", 1)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(0)
			expect(s2.actions.basic.jump.value).is(1)
		}),

		"two players can share a station": test(async() => {
			const {switchboard, time} = testSetupBravo()
			const [s1, s2] = switchboard.stations
			const d1 = testConnect(switchboard, new SamplerDevice())
			const d2 = testConnect(switchboard, new SamplerDevice())
			switchboard.shimmy(d2, -1)
			expect(switchboard.stationByDevice(d1)).is(switchboard.stationByDevice(d2))
			d1.setSample("Space", 1)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
			d2.setSample("Space", 1)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(1)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 1)
			d2.setSample("Space", 2)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(2)
			expect(s2.actions.basic.jump.value).is(0)
			d1.setSample("Space", 2)
			d2.setSample("Space", 1)
			switchboard.poll(time.now)
			expect(s1.actions.basic.jump.value).is(2)
			expect(s2.actions.basic.jump.value).is(0)
		}),
	}),
})

