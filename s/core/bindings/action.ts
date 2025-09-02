
import {isPressed} from "./parts/is-pressed.js"

export class Action {
	#value = 0
	#previous = 0

	static update(action: Action, value: number) {
		action.#previous = action.#value
		action.#value = value
	}

	get value() { return this.#value }
	get previous() { return this.#previous }
	get changed() { return this.#value !== this.#previous }
	get pressed() { return isPressed(this.#value) }
	get down() { return !isPressed(this.#previous) && isPressed(this.#value) }
	get up() { return isPressed(this.#previous) && !isPressed(this.#value) }
}

