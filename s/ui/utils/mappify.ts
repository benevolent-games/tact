
import {GMap} from "@e280/stz"

export function mappify<Item extends {id: string}>(items: Item[]) {
	return new GMap<string, Item>(items.map(item => [item.id, item]))
}

