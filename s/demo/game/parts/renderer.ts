
import {Vec2} from "@benev/math"
import {Agent} from "./agent.js"
import {State} from "./state.js"

export class Renderer {
	canvas = (() => {
		const canvas = document.createElement("canvas")
		canvas.width = 200
		canvas.height = 100
		return canvas
	})()

	ctx = this.canvas.getContext("2d")!

	constructor(public state: State) {}

	percent(n: number) {
		const shorty = Math.min(this.canvas.width, this.canvas.height)
		return Math.ceil(shorty * (n / 100))
	}

	/** take a game-state position and resolve it into canvas coordinates */
	resolve(position: Vec2) {
		return position.clone()

			// 0-1 relative to arena scale
			.divide(this.state.arenaSize)

			// flip y axis
			.morph(v => {v.y = 1 - v.y})

			// stretch to the size of the canvas
			.multiply_(this.canvas.width, this.canvas.height)
	}

	render() {
		const {state} = this
		this.#renderBackground()
		for (const agent of state.agents) {
			if (agent.alive) this.#renderAgentAlive(agent)
			else this.#renderAgentDead(agent)
		}
	}

	#getCleanCtx() {
		const {ctx} = this
		ctx.imageSmoothingEnabled = false
		ctx.fillStyle = "#000"
		ctx.strokeStyle = "#000"
		ctx.lineWidth = 1
		ctx.font = `10px sans-serif`
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		return ctx
	}

	#renderBackground() {
		const {canvas} = this
		const ctx = this.#getCleanCtx()
		ctx.fillStyle = "#000"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
	}

	#renderAgentDead(agent: Agent) {
		const ctx = this.#getCleanCtx()

		const radius = this.percent(10)
		const {position} = agent
		const [x, y] = this.resolve(position)

		// draw label
		ctx.font = `${radius * 1.3}px sans-serif`
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.fillStyle = "#fff2"
		ctx.fillText(agent.label, x, y)
	}

	#renderAgentAlive(agent: Agent) {
		const ctx = this.#getCleanCtx()

		const radius = this.percent(10)
		const {color, position} = agent
		const [x, y] = this.resolve(position)

		// circle
		ctx.beginPath()
		ctx.arc(x, y, radius, 0, Math.PI * 2)
		ctx.fillStyle = color
		ctx.fill()

		// outline
		ctx.lineWidth = this.percent(2)
		ctx.strokeStyle = "#fff"
		ctx.stroke()

		// draw label
		ctx.font = `${radius * 1.3}px sans-serif`
		ctx.textAlign = "center"
		ctx.textBaseline = "middle"
		ctx.strokeStyle = "#0004"
		ctx.strokeText(agent.label, x, y)
		ctx.fillStyle = "#fff"
		ctx.fillText(agent.label, x, y)
	}
}

