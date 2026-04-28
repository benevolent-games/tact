
import {Activity} from "./types.js"

export function mergeActivity(tuples: Activity[]): Activity[] {
	const map = new Map<number, number>()

	for (const [id, value] of tuples) {
		const previous = map.get(id) ?? 0
		map.set(id, previous + value)
	}

	return [...map.entries()]
}

