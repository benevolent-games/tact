
import {GMap, obMap} from "@e280/stz"
import {Action} from "./action.js"
import {Actions, Shape} from "./types.js"
import {decodeActivity} from "./activity/decode.js"

export function makeActionsResolver<S extends Shape<any>>(shape: S) {
	const map = new GMap<number, Action>()

	const actions = obMap(shape, bracket => obMap(bracket, id => {
		const action = new Action()
		map.set(id, action)
		return action
	})) as Actions<S>

	return (activity: Uint8Array) => {
		for (const [id, value] of decodeActivity(activity)) {
			const action = map.need(id)
			action.value = value
		}
		return actions
	}
}

