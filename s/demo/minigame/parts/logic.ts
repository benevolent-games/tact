
import {Vec2} from "@benev/math"
import {State} from "./state.js"
import {Players} from "./player.js"

export class Logic {
	constructor(
		public state: State,
		public players: Players,
	) {}

	tick() {
		for (const player of this.players) {
			const {agent, port: {actions}} = player

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

