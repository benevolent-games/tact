
import {GMap} from "@e280/stz"

export function mapOp<K, V>(entries: [K, V][], fn?: (map: GMap<K, V>) => void) {
	const map = new GMap(entries)
	fn?.(map)
	return [...map.entries()]
}

