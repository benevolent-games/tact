
import {Action} from "./action.js"
import {Bindings} from "../bindings/types.js"

export type Actions<B extends Bindings> = {
	[Mode in keyof B]: {
		[K in keyof B[Mode]]: Action
	}
}

