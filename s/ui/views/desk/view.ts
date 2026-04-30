
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Deck} from "../../deck/deck.js"

export const DeskView = shadow((deck: Deck) => {
	return html`
		<div class=deck>
			${deck.portwise.array().map(([port, controllers]) => html`
				<div class=port>
					<div>port ${port}</div>
					${controllers.array().map(([id, controller]) => html`
						<div>
							<span>${id}</span>
							<span>${controller.profile.label}</span>
						</div>
					`)}
				</div>
			`)}
		</div>
	`
})

