
import {RSet} from "@e280/strata"
import {Bindings} from "../core/types.js"
import {Controller} from "./controller.js"
import {mergeIntents} from "../core/intent/merge.js"

export class Port<B extends Bindings> extends RSet<Controller<B>> {
	resolveIntents(now: number) {
		return mergeIntents(
			[...this].flatMap(controller => controller.resolveIntents(now))
		)
	}
}

