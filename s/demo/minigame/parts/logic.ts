
import {Vec2} from "@benev/math"
import {State} from "./state.js"
import {Players} from "./player.js"
import {GameDeck} from "./game-deck.js"

export class Logic {
	players: Players

	constructor(
			public deck: GameDeck,
			public state: State,
		) {

		this.players = new Players(this.state, deck.hub.ports)

		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay", "hub")
	}

	tick() {
		for (const {port, agent} of this.players) {
			const actions = port.poll()
			this.deck.hub.actuateHubActions(port, actions)

			const speed = (actions.gameplay.sprint.pressed)
				? 3
				: 1

			if (actions.gameplay.up.pressed)
				agent.position.y += speed

			if (actions.gameplay.down.pressed)
				agent.position.y -= speed

			if (actions.gameplay.left.pressed)
				agent.position.x -= (speed)

			if (actions.gameplay.right.pressed)
				agent.position.x += (speed)

			agent.position.clamp(Vec2.zero(), this.state.arenaSize)
		}
	}
}

