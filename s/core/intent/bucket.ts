
import {Intent} from "../types.js"

/** merge/accumulate intents together */
export class IntentBucket {
	#map = new Map<number, number>()

	accumulate(intents: Intent[]) {
		for (const [id, value] of intents) {
			const previous = this.#map.get(id) ?? 0
			this.#map.set(id, Math.max(previous, value))
		}
		return this
	}

	take() {
		const intents = [...this.#map.entries()]
		this.#map.clear()
		return intents
	}
}

