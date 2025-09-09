
import {Vec2} from "@benev/math"
import {Dispenser} from "@e280/stz"
import {Agent} from "./agent.js"

export class State {
	arenaSize = new Vec2(200, 100)
	agents = new Set<Agent>()

	#colors = new Dispenser(() => [
		"#fa0",
		"#0fa",
		"#a0f",
		"#af0",
		"#0af",
		"#f0a",
	])

	makeAgent() {
		const agent = new Agent()
		agent.color = this.#colors.takeRandom()
		agent.position
			.set_(Math.random(), Math.random())
			.multiply(this.arenaSize)
		this.agents.add(agent)
		return agent
	}

	deleteAgent(agent: Agent) {
		this.agents.delete(agent)
		return this
	}
}

