
import {RMap} from "@e280/strata"
import {Agent} from "./agent.js"
import {State} from "./state.js"
import {GameBindings} from "./game-bindings.js"
import {Hub} from "../../../core/hub/hub.js"
import {Port} from "../../../core/hub/port.js"

export class Player {
	constructor(
		public port: Port<GameBindings>,
		public agent: Agent,
	) {}
}

export class Players {
	#map = new RMap<Port<GameBindings>, Player>()

	constructor(hub: Hub<GameBindings>, state: State) {
		for (const port of hub.ports)
			this.#map.set(port, new Player(port, state.makeAgent()))
	}

	;[Symbol.iterator]() {
		return this.#map.values()
	}

	require(port: Port<GameBindings>) {
		return this.#map.require(port)
	}
}

