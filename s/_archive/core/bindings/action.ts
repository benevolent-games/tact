
import {sub} from "@e280/stz"
import {isPressed} from "./parts/is-pressed.js"

export class Action {
	on = sub<[Action]>()
	onDown = sub<[Action]>()

	#value = 0
	#previous = 0

	get value() {
		return this.#value
	}

	set value(v: number) {
		this.#previous = this.#value
		this.#value = v

		this.on.publish(this)
		if (this.down) this.onDown.publish(this)
	}

	get previous() { return this.#previous }
	get changed() { return this.#value !== this.#previous }
	get pressed() { return isPressed(this.#value) }
	get down() { return !isPressed(this.#previous) && isPressed(this.#value) }
	get up() { return isPressed(this.#previous) && !isPressed(this.#value) }
}

