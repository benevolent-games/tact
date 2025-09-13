
import {ob} from "@e280/stz"
import {Deck} from "../deck.js"
import {DeckOverlay} from "./deck-overlay/component.js"

const components = {DeckOverlay}

export const deckComponents = (deck: Deck<any>) => ob(components)
	.map(C => class extends C { deck = deck }) as typeof components

