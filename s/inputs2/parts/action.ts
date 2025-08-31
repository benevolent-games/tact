
import {sub} from "@e280/stz"
import {isPressed} from "../utils/is-pressed.js"

export class Action {
	#value = 0
	#previous = 0

	static updateValue(action: Action, newValue: number) {
		action.#previous = action.#value
		action.#value = newValue
		if (action.changed) action.on.pub(action)
		if (action.down) action.onDown.pub(action)
	}

	readonly on = sub<[Action]>()
	readonly onDown = sub<[Action]>()

	get value() { return this.#value }
	get previous() { return this.#previous }
	get changed() { return this.#value !== this.#previous }
	get pressed() { return isPressed(this.#value) }
	get down() { return !isPressed(this.#previous) && isPressed(this.#value) }
	get up() { return isPressed(this.#previous) && !isPressed(this.#value) }
}


