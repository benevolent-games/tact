
import {suite, test, expect} from "@e280/science"
import {Bindings} from "./bindings/bindings.js"
import {encodeActivity} from "./activity/encode.js"
import {decodeActivity} from "./activity/decode.js"
import {Controller} from "./controller/controller.js"

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
			console.log(setupBindings().need(0))
			expect(setupBindings().need(0).action).is("shoot")
			expect(setupBindings().need(1).action).deep("forward")
			expect(setupBindings().need(2).action).deep("jump")
		}),

		"bind consistent order, mode": test(async() => {
			for (const b of [
				new Bindings({alpha: {x: "KeyX"}, bravo: {x: "KeyX"}}),
				new Bindings({bravo: {x: "KeyX"}, alpha: {x: "KeyX"}}),
			]) expect(b.need(0).mode).deep("alpha")
		}),

		"bind consistent order, action": test(async() => {
			for (const b of [
				new Bindings({x: {alpha: "KeyA", bravo: "KeyB"}}),
				new Bindings({x: {bravo: "KeyB", alpha: "KeyA"}}),
			]) expect(b.need(0).action).deep("alpha")
		}),
	}),

	activity: suite({
		"roundtrip": test(async() => {
			const activity = encodeActivity([[0, 0], [1, 1]])
			const tuples = [...decodeActivity(activity)]
			expect(tuples).deep([[0, 0], [1, 1]])
		}),
	}),

	controller: suite({
		"samples to activity": test(async() => {
			const controller = new Controller(setupBindings())
			const activity = controller.update([["KeyW", 1]])
			expect([...decodeActivity(activity)]).deep([[1, 1]])
		}),
	}),

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

