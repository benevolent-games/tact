
import {sub} from "@e280/stz"
import {Fork} from "../units/fork.js"

export const _poll = Symbol("poll")

export class Action {
	value = 0
	previous = 0
	on = sub<[Action]>()

	constructor(public fork: Fork) {}

	get isChanged() {
		return this.value !== this.previous
	}

	[_poll](now: number) {
		this.previous = this.value
		this.value = this.fork.poll(now)
		if (this.isChanged)
			this.on.pub(this)
	}
}

