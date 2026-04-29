
import {Intent} from "../types.js"

export function mergeIntents(intents: Intent[]): Intent[] {
	const map = new Map<number, number>()

	for (const [id, value] of intents) {
		const previous = map.get(id) ?? 0
		map.set(id, previous + value)
	}

	return [...map.entries()]
}

