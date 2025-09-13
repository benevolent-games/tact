
import {ob} from "@e280/stz"
import {Deck} from "../deck.js"
import {DropFirstParam} from "../../utils/types.js"
import {DeckOverlay} from "./deck-overlay/component.js"

const components = {DeckOverlay}

export const deckComponents = (deck: Deck<any>) => (
	ob(components)
		.map(C => class extends C { deck = deck })
) as DeckComponents

export type DeckComponents = typeof components

export type DeckViews = {
	[P in keyof DeckComponents]: (
		DropFirstParam<DeckComponents[P]["view"]>
	)
}

