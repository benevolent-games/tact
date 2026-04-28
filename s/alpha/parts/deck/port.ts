
import {RSet} from "@e280/strata"
import {BindingsData} from "../types.js"
import {Controller} from "./controller.js"
import {mergeTuples} from "../activity/merge.js"

export class Port<B extends BindingsData> extends RSet<Controller<B>> {
	constructor(...controllers: Controller<B>[]) {
		super(controllers)
	}

	resolveActivity(now: number) {
		return mergeTuples(
			[...this]
				.flatMap(controller => controller.resolveActivity(now))
		)
	}
}

