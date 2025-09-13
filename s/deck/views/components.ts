
import {ob} from "@e280/stz"
import {Deck} from "../deck.js"
import {DeckBind} from "./deck-bind/component.js"
import {DeckOverlay} from "./deck-overlay/component.js"

const components = {
	DeckBind,
	DeckOverlay,
}

export const deckComponents = (deck: Deck<any>) => ob(components)
	.map(c => c(deck)) as {
		[P in keyof typeof components]: ReturnType<(typeof components)[P]>
	}

