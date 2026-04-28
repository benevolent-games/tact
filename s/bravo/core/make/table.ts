
import {GMap} from "@e280/stz"
import {Bindings, BindingsRow} from "../types.js"
import {sortByKey} from "../../utils/sort-by-key.js"

export function makeTable<B extends Bindings>(data: B) {
	data = structuredClone(data)
	const table = new GMap<number, BindingsRow<B>>()

	Object.entries(data)
		.sort(sortByKey)
		.flatMap(([mode, bracket]) =>
			Object.entries(bracket)
				.sort(sortByKey)
				.map(([action, atom]) => ({mode, action, atom}))
		)
		.forEach((bind, id) => {
			table.set(id, {...bind, id})
		})

	return table
}

