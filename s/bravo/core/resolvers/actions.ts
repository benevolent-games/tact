
import {GMap, obMap} from "@e280/stz"
import {Action} from "../parts/action.js"
import {bindingsShape} from "../bindings/shape.js"
import {Actions, Bindings, Intent} from "../types.js"

export function makeActionsResolver<B extends Bindings>(bindings: B) {
	const shape = bindingsShape(bindings)
	const map = new GMap<number, Action>()

	const actions = obMap(shape, bracket => obMap(bracket, id => {
		const action = new Action()
		map.set(id, action)
		return action
	})) as Actions<B>

	return (intents: Intent[]) => {
		for (const [id, value] of intents) {
			const action = map.need(id)
			action.value = value
		}
		return actions
	}
}

