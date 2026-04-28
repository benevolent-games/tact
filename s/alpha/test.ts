
import {suite, test, expect} from "@e280/science"
import {Bindings} from "./parts/bindings.js"
import {encodeActivity} from "./parts/activity/encode.js"
import {decodeActivity} from "./parts/activity/decode.js"
import {makeActionsResolver} from "./parts/make-actions-resolver.js"
import {makeActivityResolver} from "./parts/make-activity-resolver.js"

function exampleBindings() {
	return new Bindings({
		running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
		gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
	})
}

export default suite({
	bindings: suite({
		"shape": test(async() => {
			expect(exampleBindings().shape.running.forward).ok()
		}),

		"binds by index": test(async() => {
			expect(exampleBindings().need(0).action).is("shoot")
			expect(exampleBindings().need(1).action).deep("forward")
			expect(exampleBindings().need(2).action).deep("jump")
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

	resolver: suite({
		"resolve samples to activity": test(async() => {
			const resolveActivity = makeActivityResolver(exampleBindings())
			const activity = resolveActivity(0, [["KeyW", 1]])
			expect(activity).deep([[1, 1]])
		}),
	}),

	compiler: suite({
		"compile activity to actions": test(async() => {
			const resolveActions = makeActionsResolver(exampleBindings().shape)
			const actions = resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(true)
		}),
	}),
})

