
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Deck} from "../../deck/deck.js"

export const DeckView = shadow((deck: Deck) => {
	return html`
		<div class=deck>
			${deck.portwise.array().map(([port, devices]) => html`
				<div class=port>
					<span>port ${port}</span>
				</div>
			`)}
		</div>
	`
})

