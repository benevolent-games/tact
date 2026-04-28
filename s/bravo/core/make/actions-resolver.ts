
import {GMap, obMap} from "@e280/stz"
import {Action} from "../parts/action.js"
import {Actions, BindingsShape, Intent} from "../types.js"

export function makeActionsResolver<S extends BindingsShape<any>>(shape: S) {
	const map = new GMap<number, Action>()

	const actions = obMap(shape, bracket => obMap(bracket, id => {
		const action = new Action()
		map.set(id, action)
		return action
	})) as Actions<S>

	return (intents: Intent[]) => {
		for (const [id, value] of intents) {
			const action = map.need(id)
			action.value = value
		}
		return actions
	}
}

