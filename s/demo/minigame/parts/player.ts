
import {RzMap} from "@e280/strata"
import {Agent} from "./agent.js"
import {State} from "./state.js"
import {GameBindings} from "./game-deck.js"
import {Port} from "../../../core/port/port.js"

export class Player {
	constructor(
		public port: Port<GameBindings>,
		public agent: Agent,
	) {}
}

export class Players {
	#map = new RzMap<Port<GameBindings>, Player>()

	constructor(state: State, ports: Port<GameBindings>[]) {
		for (const port of ports)
			this.#map.set(port, new Player(port, state.makeAgent()))
	}

	;[Symbol.iterator]() {
		return this.#map.values()
	}

	require(port: Port<GameBindings>) {
		return this.#map.require(port)
	}
}

