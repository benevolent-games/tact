
import {suite, test, expect} from "@e280/science"
import {Bindings} from "./bindings/bindings.js"

export default suite({
	"bindings shape": test(async() => {
		const bindings = new Bindings({
			running: {forward: "KeyW", jump: "Space"},
			gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
		})
		expect(bindings.shape.running.forward).is(true)
	}),
})

