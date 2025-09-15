
import {html} from "lit"
import {cssReset, view} from "@e280/sly"
import {Deck} from "../../deck.js"
import styleCss from "./style.css.js"
import {DeckComponent} from "../framework.js"

export class DeckBindings extends (
	view(use => (deck: Deck<any>) => {
		use.css(cssReset, styleCss)
		use.attrs.string.deck = "bindings"
		const {hub, deviceSkins} = deck

		return html`
			<div class=plate>
				<p>bindings</p>
			</div>
		`
	})
	.component(DeckComponent)
	.props(el => [el.deck])
) {}

