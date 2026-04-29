
import {suite, test, expect} from "@e280/science"
import {bindingsShape} from "./parts/shape.js"
import {bindingsTable} from "./parts/table.js"
import {asBindings, Intent} from "./types.js"
import {encodeIntents} from "./intent/encode.js"
import {decodeIntents} from "./intent/decode.js"
import {makeIntentsResolver} from "./resolvers/intents.js"
import {makeActionsResolver} from "./resolvers/actions.js"

export const exampleBindings = asBindings({
	running: {forward: "KeyW", jump: ["and", "ShiftLeft", "Space"]},
	gunning: {shoot: ["or", "pointer.button.left", "gamepad.trigger.right"]},
})

export default suite({
	bindings: suite({
		"shape": test(async() => {
			expect(bindingsShape(exampleBindings).running.forward).ok()
		}),

		"table actions": test(async() => {
			expect(bindingsTable(exampleBindings).need(0).action).is("shoot")
			expect(bindingsTable(exampleBindings).need(1).action).deep("forward")
			expect(bindingsTable(exampleBindings).need(2).action).deep("jump")
		}),

		"table consistent ordering, mode": test(async() => {
			for (const b of [
				bindingsTable({alpha: {x: "KeyX"}, bravo: {x: "KeyX"}}),
				bindingsTable({bravo: {x: "KeyX"}, alpha: {x: "KeyX"}}),
			]) expect(b.need(0).mode).deep("alpha")
		}),

		"table consistent ordering, action": test(async() => {
			for (const b of [
				bindingsTable({x: {alpha: "KeyA", bravo: "KeyB"}}),
				bindingsTable({x: {bravo: "KeyB", alpha: "KeyA"}}),
			]) expect(b.need(0).action).deep("alpha")
		}),
	}),

	intents: suite({
		"encoded roundtrip": test(async() => {
			const intentsA: Intent[] = [[0, 0], [1, 1]]
			const bytes = encodeIntents(intentsA)
			const intentsB = decodeIntents(bytes)
			expect(intentsB).deep(intentsA)
		}),
	}),

	intentsResolver: suite({
		"resolve samples to intents": test(async() => {
			const resolveIntents = makeIntentsResolver(exampleBindings)
			const intents = resolveIntents(0, [["KeyW", 1]])
			expect(intents).deep([[1, 1]])
		}),
	}),

	actionsResolver: suite({
		"resolve intents to actions": test(async() => {
			const resolveActions = makeActionsResolver(exampleBindings)
			const actions = resolveActions([[1, 1]])
			expect(actions.running.forward.value).is(1)
			expect(actions.running.forward.down).is(true)
			expect(actions.running.forward.changed).is(true)
		}),
	}),
})

