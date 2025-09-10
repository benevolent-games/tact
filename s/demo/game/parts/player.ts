
import {RMap} from "@e280/strata"
import {Agent} from "./agent.js"
import {State} from "./state.js"
import {GameHub, GamePort} from "./game-bindings.js"

export class Player {
	constructor(
		public port: GamePort,
		public agent: Agent,
	) {}
}

export class Players {
	#map = new RMap<GamePort, Player>()

	constructor(hub: GameHub, state: State) {
		for (const [index, port] of hub.ports.entries()) {
			const label = (index + 1).toString()
			this.#map.set(port, new Player(port, state.makeAgent(label)))
		}
	}

	;[Symbol.iterator]() {
		return this.#map.values()
	}

	require(port: GamePort) {
		return this.#map.require(port)
	}
}

