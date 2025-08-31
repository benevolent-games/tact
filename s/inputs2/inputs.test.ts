
import {Science, test, expect} from "@e280/science"
import {SamplerDevice} from "./devices/infra/sampler.js"
import {testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {player, device, time} = testSetupAlpha()
		expect(player.actions.basic.jump.value).is(0)
		expect(player.actions.basic.shoot.value).is(0)
		device.setSample("Space", 1)
		player.poll(time.now)
		expect(player.actions.basic.jump.value).is(1)
		expect(player.actions.basic.shoot.value).is(0)
		device.setSample("Space", 2)
		device.setSample("mouse.button.left", 3)
		player.poll(time.now)
		expect(player.actions.basic.jump.value).is(2)
		expect(player.actions.basic.shoot.value).is(3)
	}),

	"seating": Science.suite({
		"player1 inputs work": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.players
			const device1 = seating.connect(new SamplerDevice())
			expect(player1.actions.basic.jump.value).is(0)
			expect(player2.actions.basic.jump.value).is(0)
			device1.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(1)
			expect(player2.actions.basic.jump.value).is(0)
		}),

		"two players playing on separate seats": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.players
			const device1 = seating.connect(new SamplerDevice())
			const device2 = seating.connect(new SamplerDevice())
			device1.setSample("Space", 1)
			device2.setSample("Space", 2)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(1)
			expect(player2.actions.basic.jump.value).is(2)
		}),

		"player can shimmy seats": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.players
			const device1 = seating.connect(new SamplerDevice())
			seating.shimmy(device1, 1)
			device1.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(0)
			expect(player2.actions.basic.jump.value).is(1)
		}),

		"two players can share a seat": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.players
			const device1 = seating.connect(new SamplerDevice())
			const device2 = seating.connect(new SamplerDevice())
			seating.shimmy(device2, -1)
			expect(seating.playerByDevice(device1)).is(seating.playerByDevice(device2))
			device1.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(1)
			expect(player2.actions.basic.jump.value).is(0)
			device2.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(1)
			expect(player2.actions.basic.jump.value).is(0)
			device1.setSample("Space", 1)
			device2.setSample("Space", 2)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(2)
			expect(player2.actions.basic.jump.value).is(0)
			device1.setSample("Space", 2)
			device2.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(2)
			expect(player2.actions.basic.jump.value).is(0)
		}),
	}),
})

