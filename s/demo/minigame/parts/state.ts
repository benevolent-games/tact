
import {Dispenser} from "@e280/stz"
import {Agent} from "./agent.js"

export class State {
	agents = new Set<Agent>()
	#colors = new Dispenser(() => [
		"#aaa",
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
		agent.position = [Math.random(), Math.random()]
		this.agents.add(agent)
		return agent
	}

	deleteAgent(agent: Agent) {
		this.agents.delete(agent)
		return this
	}
}

