
import { Pipe, pipe } from "@e280/stz"
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

	resolve([x, y]: [x: number, y: number]) {
		return [
			pipe(x).line(
				a => Math.max(a, 0),
				a => Math.min(a, 1),
				a => a * this.canvas.width,
			),
			pipe(y).line(
				a => Math.max(a, 0),
				a => Math.min(a, 1),
				a => 1 - a,
				a => a * this.canvas.height,
			),
		] as [x: number, y: number]
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
		}
	}
}

