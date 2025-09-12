
import {Vec2} from "@benev/math"
import {Agent} from "./agent.js"

export class State {
	arenaSize = new Vec2(200, 100)
	agents = new Set<Agent>()

	makeAgent(label: string) {
		const agent = new Agent()
		agent.label = label
		agent.position
			.set_(0.5, 0.5)
			.multiply(this.arenaSize)
		this.agents.add(agent)
		return agent
	}

	deleteAgent(agent: Agent) {
		this.agents.delete(agent)
		return this
	}
}

