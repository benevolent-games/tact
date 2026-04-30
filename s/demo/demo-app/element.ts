
import {html} from "lit"
import {shadowElement, useCss} from "@e280/sly"
import styleCss from "./style.css.js"
import {Deck} from "../../ui/deck/deck.js"
import {DeckView} from "../../ui/views/deck/view.js"

export const setupDemoApp = (deck: Deck) => shadowElement(() => {
	useCss(styleCss)

	return html`
		<div class=plate>
			${DeckView(deck)}
		</div>
	`
})

