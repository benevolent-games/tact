
import {GMap, obMap} from "@e280/stz"
import {Action} from "./action.js"
import {Actions, Shape} from "./types.js"
import {decodeActivity} from "./activity/decode.js"

export class Port<S extends Shape<any>> {
	actions
	#map = new GMap<number, Action>()

	constructor(shape: S) {
		this.actions = obMap(shape, bracket => obMap(bracket, id => {
			const action = new Action()
			this.#map.set(id, action)
			return action
		})) as Actions<S>
	}

	update(activity: Uint8Array) {
		for (const [id, value] of decodeActivity(activity)) {
			const action = this.#map.need(id)
			action.value = value
		}
		return this.actions
	}
}

