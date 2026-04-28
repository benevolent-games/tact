
import {GMap, obMap} from "@e280/stz"
import {Action} from "./action.js"
import {Actions, Activity, Shape} from "./types.js"

export function makeActionsResolver<S extends Shape<any>>(shape: S) {
	const map = new GMap<number, Action>()

	const actions = obMap(shape, bracket => obMap(bracket, id => {
		const action = new Action()
		map.set(id, action)
		return action
	})) as Actions<S>

	return (activity: Activity[]) => {
		for (const [id, value] of activity) {
			const action = map.need(id)
			action.value = value
		}
		return actions
	}
}

