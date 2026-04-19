
import {suite, test, expect} from "@e280/science"
import {Bindings} from "./bindings/bindings.js"

function setupBindings() {
	return new Bindings({
		running: {forward: "KeyW", jump: "Space"},
		gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
	})
}

export default suite({
	bindings: suite({
		"shape": test(async() => {
			expect(setupBindings().shape.running.forward).is(true)
		}),

		"binds": test(async() => {
			expect(setupBindings().getBind(0)).deep({mode: "gunning", action: "shoot"})
			expect(setupBindings().getBind(1)).deep({mode: "running", action: "forward"})
			expect(setupBindings().getBind(2)).deep({mode: "running", action: "jump"})
		}),
	}),
})

