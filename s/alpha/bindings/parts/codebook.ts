
import {GMap} from "@e280/stz"
import {BindingsData} from "../types.js"
import {sortByKey} from "./sort-by-key.js"

export function makeCodebook<B extends BindingsData>(bindings: B) {
	const codebook = new GMap<number, [mode: keyof B, action: keyof B[keyof B]]>()

	const binds = Object.entries(bindings)
		.sort(sortByKey)
		.flatMap(([mode, bracket]) =>
			Object.entries(bracket)
				.sort(sortByKey)
				.map(([action]) => [mode, action] as [string, string])
		)

	for (const [index, bind] of binds.entries())
		codebook.set(index, bind)

	return codebook
}

