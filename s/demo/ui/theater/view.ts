
import {html} from "lit"
import {view} from "@e280/sly"

import {styles} from "./styles.css.js"
import {Minigame} from "../../minigame/minigame.js"
import {GameDeck} from "../../minigame/parts/game-deck.js"

export const Theater = view(use => (deck: GameDeck) => {
	use.css(styles)

	const minigame = use.once(() => new Minigame(deck))
	use.mount(() => minigame.loop(60))

	return html`
		${minigame.renderer.canvas}
	`
})

