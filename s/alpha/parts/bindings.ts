
import {GMap, obMap} from "@e280/stz"
import {sortByKey} from "./utils/sort-by-key.js"
import {Bind, BindingsData, Shape} from "./types.js"

export class Bindings<B extends BindingsData> {
	#data
	#binds = new GMap<number, Bind<B>>()

	constructor(data: B) {
		this.#data = data

		Object.entries(data)
			.sort(sortByKey)
			.flatMap(([mode, bracket]) =>
				Object.entries(bracket)
					.sort(sortByKey)
					.map(([action, atom]) => ({mode, action, atom}))
			)
			.forEach((bind, id) => {
				this.#binds.set(id, {...bind, id})
			})
	}

	get shape() {
		const shape = obMap(this.#data, bracket => obMap(bracket, () => 0)) as any
		for (const [id, {mode, action}] of this.#binds)
			shape[mode][action] = id
		return shape as Shape<B>
	}

	*list() {
		yield* this.#binds.values()
	}

	need(id: number) {
		return this.#binds.need(id)
	}
}

