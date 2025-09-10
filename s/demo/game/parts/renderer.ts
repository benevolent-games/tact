
import {State} from "./state.js"
import {Vec2} from "@benev/math"

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
		const {ctx, canvas, state} = this
		ctx.imageSmoothingEnabled = false

		ctx.fillStyle = "#000"
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		const radius = this.percent(10)

		for (const agent of state.agents) {
			if (!agent.alive) continue

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
}

