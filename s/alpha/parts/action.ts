
import {sub} from "@e280/stz"
import {isPressed} from "./utils/is-pressed.js"

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
		if (this.changedDown) this.onDown.publish(this)
	}

	get previous() { return this.#previous }
	get changed() { return this.#value !== this.#previous }
	get pressed() { return isPressed(this.#value) }
	get up() { return !this.pressed }
	get down() { return this.pressed }
	get changedUp() { return this.changed && this.up }
	get changedDown() { return this.changed && this.down }
}

