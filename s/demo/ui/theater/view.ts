
import {html} from "lit"
import {view} from "@e280/sly"

import {styles} from "./styles.css.js"
import {Minigame} from "../../minigame/minigame.js"
import {GameDeck} from "../../minigame/parts/game-deck.js"

export const Theater = view(use => (deck: GameDeck) => {
	use.css(styles)

	const minigame = use.once(() => new Minigame(deck))
	use.mount(() => minigame.loop(60))
	use.mount(() => minigame.deck.hub.on(use.render))

	return html`
		${minigame.renderer.canvas}

		<div class=ports>
			${[...minigame.logic.players].map(player => html`
				<div style="color: ${player.agent.color};">
					<span>port</span>
					<div>
						${[...player.port.controllers].map(controller => {
							const mechanism = minigame.mechanisms.require(controller)
							return html`
								<span>${mechanism.label}</span>
							`
						})}
					</div>
				</div>
			`)}
		</div>
	`
})

