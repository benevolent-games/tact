
import {derived} from "@e280/strata"
import {Runtime} from "./parts/runtime.js"
import {Controller} from "./controller.js"

export class Port {
	#runtime
	#pluggedControllers

	constructor(runtime: Runtime) {
		this.#runtime = runtime
		this.#pluggedControllers = derived(
			() => this.#runtime.controllers.array()
				.filter(controller => this.#runtime.portAssignments.get(controller) === this)
		)
	}

	get pluggedControllers() {
		return this.#pluggedControllers()
	}

	plug(controller: Controller) {
		this.#runtime.portAssignments.set(controller, this)
	}

	unplug(controller: Controller) {
		this.#runtime.portAssignments.delete(controller)
	}

	resolveIntents(now: number) {
		return this.pluggedControllers
			.flatMap(controller => controller.resolveIntents(now))
	}
}

