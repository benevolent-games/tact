
import {html} from "lit"
import {view} from "@e280/sly"

import {styles} from "./styles.css.js"
import {Minigame} from "../../minigame/minigame.js"
import {GameDeck} from "../../minigame/parts/game-deck.js"
import {GameKeyboard, GameStick} from "../../minigame/parts/controllers.js"
import { NubStick } from "../../../nubs/stick/view.js"

export const Theater = view(use => (deck: GameDeck) => {
	use.css(styles)

	const minigame = use.once(() => new Minigame(deck))
	use.mount(() => minigame.loop(60))
	use.mount(() => minigame.deck.hub.on(use.render))

	return html`
		${minigame.renderer.canvas}

		<div class=ports>
			${[...minigame.logic.players].map((player, index) => html`
				<div style="color: ${player.agent.color};">
					<span>p${index + 1}</span>
					<div>
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
				</div>
			`)}
		</div>
	`
})

