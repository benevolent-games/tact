
import {coalesce, ev, sub} from "@e280/stz"
import {Sample} from "../types.js"
import {Controller} from "./infra/controller.js"
import {modprefix} from "../utils/modprefix.js"

export class KeyboardController extends Controller {
	on = sub<Sample>()
	dispose: () => void
	#held = new Set<string>()

	constructor(target: EventTarget = window) {
		super()

		const down = (code: string) => {
			this.#held.add(code)
			this.on.pub(code, 1)
		}

		const up = (code: string) => {
			this.#held.delete(code)
			this.on.pub(code, 0)
		}

		this.dispose = coalesce(
			ev(target, {
				keydown: (event: KeyboardEvent) => {
					if (event.repeat) return
					down(event.code)
					down(modprefix(event, event.code))
				},
				keyup: (event: KeyboardEvent) => {
					up(event.code)
					up(modprefix(event, event.code))
				},
			}),

			ev(window, {
				blur: () => {
					for (const code of this.#held)
						this.on.pub(code, 0)
					this.#held.clear()
				},
			})
		)
	}

	takeSamples() {
		return [...this.#held]
			.map(code => [code, 1] as Sample)
	}
}

