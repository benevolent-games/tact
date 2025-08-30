
import {Science, test, expect} from "@e280/science"
import {SamplerDevice} from "./parts/device.js"
import {testFrame, testSetupAlpha, testSetupBravo} from "./testing/testing.js"

export default Science.suite({
	"sample to action value": test(async() => {
		const {inputs, device} = testSetupAlpha()
		expect(inputs.actions.basic.jump.value).is(0)
		device.setSample("Space", 1)
		inputs.poll(testFrame(0))
		expect(inputs.actions.basic.jump.value).is(1)
	}),

	"seating": Science.suite({
		"lolol": test(async() => {
			const {seating} = testSetupBravo()
			const [player1, player2, player3, player4] = seating.seats
			const device1 = new SamplerDevice()
			const port1 = seating.connect(device1)
		}),
	}),
})

