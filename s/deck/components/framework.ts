
import {BaseElement} from "@e280/sly"
import {Deck} from "../deck.js"

export class DeckComponent extends BaseElement {
	#deck: Deck<any> | undefined

	get deck() {
		if (!this.#deck) throw new Error(".deck was not set on component, but is required")
		return this.#deck
	}

	set deck(d: Deck<any>) {
		this.#deck = d
	}
}

