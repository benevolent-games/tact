
import {GMap, is} from "@e280/stz"

export class Identifier<Item> {
	#nextId = 0
	#ids = new GMap<Item, number>()
	#items = new GMap<number, Item>()

	id(item: Item) {
		const id = this.#ids.guarantee(item, () => {
			const freshId = this.#nextId++
			this.#items.set(freshId, item)
			return freshId
		})
		return id
	}

	need(id: number) {
		return this.#items.need(id)
	}

	delete(item: Item) {
		const id = this.#ids.get(item)
		if (is.happy(id)) {
			this.#ids.delete(item)
			this.#items.delete(id)
		}
	}
}

