
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
			const speed = 1
			agent.position.y += speed * actions.gameplay.up.value
			agent.position.y -= speed * actions.gameplay.down.value
			agent.position.x -= speed * actions.gameplay.left.value
			agent.position.x += speed * actions.gameplay.right.value
			agent.position.clamp(Vec2.zero(), this.state.arenaSize)
		}
	}
}

