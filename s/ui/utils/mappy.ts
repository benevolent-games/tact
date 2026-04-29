
import {GMap} from "@e280/stz"
import {mappify} from "./mappify.js"

export function mappy<Item extends {id: string}>(items: Item[], fn: (map: GMap<string, Item>) => void) {
	const map = mappify(items)
	fn(map)
	return [...map.values()]
}

