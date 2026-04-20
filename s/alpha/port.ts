
import {GMap, obMap} from "@e280/stz"
import {Shape} from "./types.js"
import {Action} from "./action.js"
import {decodeActivity} from "./activity/decode.js"

export type Actions<S extends Shape<any>> = {
	[M in keyof S]: {
		[A in keyof S[M]]: Action
	}
}

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

