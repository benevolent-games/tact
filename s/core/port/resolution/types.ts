
import {Actions} from "../types.js"
import {SampleMap} from "../../controllers/types.js"
import {Bindings, LensSettings} from "../../bindings/types.js"

export type ResolverContext = {
	now: number
	bindings: Bindings
	modes: Set<keyof Bindings>
	samples: SampleMap
	lensStates?: LensState[]
	previousActions?: Actions<Bindings>
}

export type LensState = {
	settings: LensSettings
	lastValue: number
	holdStart: number
}

export type Resolution<B extends Bindings> = {
	actions: Actions<B>
	lensStates: LensState[]
}

