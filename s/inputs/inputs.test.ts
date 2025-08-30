
import {Science, test, expect} from "@e280/science"
import {SamplerDevice} from "./parts/device.js"
import {testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {inputs, device, time} = testSetupAlpha()
		expect(inputs.actions.basic.jump.value).is(0)
		device.setSample("Space", 1)
		inputs.poll(time.now)
		expect(inputs.actions.basic.jump.value).is(1)
	}),

	"multiplayer device seating": Science.suite({
		"player1 inputs work": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.seats
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
			const [player1, player2] = seating.seats
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
			const [player1, player2] = seating.seats
			const device1 = seating.connect(new SamplerDevice())
			seating.shimmy(device1, 1)
			device1.setSample("Space", 1)
			seating.poll(time.now)
			expect(player1.actions.basic.jump.value).is(0)
			expect(player2.actions.basic.jump.value).is(1)
		}),

		"two players can share a seat": test(async() => {
			const {seating, time} = testSetupBravo()
			const [player1, player2] = seating.seats
			const device1 = seating.connect(new SamplerDevice())
			const device2 = seating.connect(new SamplerDevice())
			seating.shimmy(device2, -1)
			expect(seating.lookupSeat(device1)).is(seating.lookupSeat(device2))
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

