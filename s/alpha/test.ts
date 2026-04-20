
import {suite, test, expect} from "@e280/science"
import {Bindings} from "./bindings/bindings.js"
import {encodeActivity} from "./activity/encode.js"
import {decodeActivity} from "./activity/decode.js"

function setupBindings() {
	return new Bindings({
		running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
		gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
	})
}

export default suite({
	bindings: suite({
		"shape": test(async() => {
			expect(setupBindings().shape.running.forward).ok()
		}),

		"binds by index": test(async() => {
			expect(setupBindings().getBind(0)).deep({mode: "gunning", action: "shoot"})
			expect(setupBindings().getBind(1)).deep({mode: "running", action: "forward"})
			expect(setupBindings().getBind(2)).deep({mode: "running", action: "jump"})
		}),

		"bind consistent order, mode": test(async() => {
			for (const b of [
				new Bindings({alpha: {x: "KeyX"}, bravo: {x: "KeyX"}}),
				new Bindings({bravo: {x: "KeyX"}, alpha: {x: "KeyX"}}),
			]) expect(b.getBind(0)).deep({mode: "alpha", action: "x"})
		}),

		"bind consistent order, action": test(async() => {
			for (const b of [
				new Bindings({x: {alpha: "KeyA", bravo: "KeyB"}}),
				new Bindings({x: {bravo: "KeyB", alpha: "KeyA"}}),
			]) expect(b.getBind(0)).deep({mode: "x", action: "alpha"})
		}),
	}),

	activity: suite({
		"roundtrip": test(async() => {
			const activity = encodeActivity([[0, 0], [1, 1]])
			const acts = [...decodeActivity(activity)]
			expect(acts).deep([[0, 0], [1, 1]])
		}),
	}),

	// controller: suite({
	// 	"samples to activity": test(async() => {
	// 		const controller = new Controller(setupBindings())
	// 		const activity = controller.update(["KeyW", 1])
	// 		expect([...decodeActivity(activity)]).deep([[1, 1]])
	// 	}),
	// }),

	// port: suite({
	// 	"activity to actions": test(async() => {
	// 		const port = new Port(setupBindings().shape)
	// 		expect(port.actions.running.forward.value).is(0)
	// 		const actions = port.update(encodeActivity([[1, 1]]))
	// 		expect(port.actions.running.forward.value).is(1)
	// 		expect(actions.running.forward.value).is(1)
	// 		expect(actions.running.forward.pressed).is(true)
	// 		expect(actions.running.forward.changed).is(true)
	// 	}),
	// }),
})

