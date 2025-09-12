
import {Content, Use, view} from "@e280/sly"
import {Deck} from "../deck.js"

export function deckView(
		fn: (deck: Deck<any>) => (use: Use) => Content
	) {

	return (deck: Deck<any>) => {
		const fn2 = fn(deck)
		return view(use => () => fn2(use))
	}
}

