
import {sub} from "@e280/stz"
import {Fork} from "../units/fork.js"
import {isPressed} from "../utils/is-pressed.js"

export const _poll = Symbol("poll")

export class Action {
	value = 0
	previous = 0
	on = sub<[Action]>()
	onDown = sub<[Action]>()

	constructor(public fork: Fork) {}

	get changed() {
		return this.value !== this.previous
	}

	get pressed() {
		return isPressed(this.value)
	}

	get down() {
		return !isPressed(this.previous) && isPressed(this.value)
	}

	get up() {
		return isPressed(this.previous) && !isPressed(this.value)
	}

	[_poll](now: number) {
		this.previous = this.value
		this.value = this.fork.poll(now)
		if (this.changed) this.on.pub(this)
		if (this.down) this.onDown.pub(this)
	}
}

