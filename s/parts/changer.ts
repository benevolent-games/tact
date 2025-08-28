
import {sub} from "@e280/stz"

export class Changer<X> {
	#value: X
	#previous: X

	on = sub<[X]>()

	constructor(value: X, public intercept: (x: X) => X = x => x) {
		this.#value = value
		this.#previous = value
	}

	get value() {
		return this.#value
	}

	set value(value: X) {
		value = this.intercept(value)
		this.#previous = this.#value
		this.#value = value
		if (this.changed)
			this.on.pub(value)
	}

	get previous() {
		return this.#previous
	}

	get changed() {
		return this.#value !== this.#previous
	}
}

