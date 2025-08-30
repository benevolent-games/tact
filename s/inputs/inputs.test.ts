
import {Science, test, expect} from "@e280/science"
import {TestDevice, testFrame, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {inputs, device} = testSetupAlpha()
		expect(inputs.actions.basic.jump.value).is(0)
		device.sampler.set("Space", 1)
		inputs.poll(testFrame(0))
		expect(inputs.actions.basic.jump.value).is(1)
	}),

	"seating": Science.suite({
		"lolol": test(async() => {
			const {seating} = testSetupBravo()
			const [player1, player2, player3, player4] = seating.seats
			const device1 = new TestDevice()
			const port1 = seating.connect(new TestDevice())
		}),
	}),
})

