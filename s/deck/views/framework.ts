
import {BaseElement} from "@e280/sly"
import {Constructor} from "@e280/stz"
import {Deck} from "../deck.js"

export function dc<C extends Constructor<BaseElement>>(
		fn: (deck: Deck<any>) => C
	) {
	return fn
}

