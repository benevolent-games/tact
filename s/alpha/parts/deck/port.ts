
import {RSet} from "@e280/strata"
import {BindingsData} from "../types.js"
import {Controller} from "./controller.js"
import {mergeActivity} from "../activity/merge.js"

export class Port<B extends BindingsData> extends RSet<Controller<B>> {
	constructor(...controllers: Controller<B>[]) {
		super(controllers)
	}

	resolveActivity(now: number) {
		return mergeActivity(
			[...this].flatMap(controller => controller.resolveActivity(now))
		)
	}
}

