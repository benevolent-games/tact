
import {html} from "lit"
import {view} from "@e280/sly"

import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {NubStick} from "../../../nubs/stick/view.js"
import {GameKeyboard, GameStick} from "../../game/parts/controllers.js"

export const Theater = view(use => (game: Game) => {
	use.css(styles)
	use.mount(() => game.loop(60))
	use.mount(() => game.deck.hub.on(use.render))

	return html`
		${game.renderer.canvas}

		<div class=ports>
			${[...game.logic.players].map((player, index) => html`
				<div style="--color: ${player.agent.color};">
					<h3>p${index + 1}</h3>
					${[...player.port.controllers].map(controller => {
						if (controller instanceof GameKeyboard)
							return html`
								<span>⌨️</span>
							`
						else if (controller instanceof GameStick)
							return html`
								${NubStick(controller)}
							`
					})}
				</div>
			`)}
		</div>
	`
})

