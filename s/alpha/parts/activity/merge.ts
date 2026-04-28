
import {ActivityTuple} from "./types.js"

export function mergeTuples(tuples: ActivityTuple[]): ActivityTuple[] {
	const map = new Map<number, number>()

	for (const [id, value] of tuples) {
		const previous = map.get(id) ?? 0
		map.set(id, previous + value)
	}

	return [...map.entries()]
}

