
import {Vec2} from "@benev/math"
import {Dispenser} from "@e280/stz"
import {Agent} from "./agent.js"

export class State {
	arenaSize = new Vec2(200, 100)
	agents = new Set<Agent>()

	#colors = new Dispenser(() => [
		"#0fa",
		"#0af",
		"#a0f",
		"#fa0",
		"#af0",
		"#f0a",
	])

	makeAgent(label: string) {
		const agent = new Agent()
		agent.label = label
		agent.color = this.#colors.takeFirst()!
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

