
import {MapG, pipe} from "@e280/stz"
import {Agent} from "./agent.js"
import {GameDeck} from "./load-deck.js"
import {Port} from "../../../core/port/port.js"

export class Logic {
	constructor(
			public deck: GameDeck,
			public agents: MapG<Port<any>, Agent>,
		) {
		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay", "hub")
	}

	tick() {
		const speed = 0.02

		function clamp(x: number) {
			return pipe(x).line(
				a => Math.max(a, 0),
				a => Math.min(a, 1),
			)
		}

		for (const [port, agent] of this.agents) {
			const actions = port.poll()

			if (actions.gameplay.up.pressed)
				agent.position[1] += (speed * 2)

			if (actions.gameplay.down.pressed)
				agent.position[1] -= (speed * 2)

			if (actions.gameplay.left.pressed)
				agent.position[0] -= (speed)

			if (actions.gameplay.right.pressed)
				agent.position[0] += (speed)

			agent.position[0] = clamp(agent.position[0])
			agent.position[1] = clamp(agent.position[1])
		}
	}
}

