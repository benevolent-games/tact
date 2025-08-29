
import {sub} from "@e280/stz"
import {Fork} from "./fork.js"

export class Action {
	value = 0
	previous = 0
	on = sub<[Action]>()

	constructor(public fork: Fork) {}

	get isChanged() {
		return this.value !== this.previous
	}

	poll(now: number) {
		this.previous = this.value
		this.value = this.fork.poll(now)
		if (this.isChanged)
			this.on.pub(this)
	}
}

