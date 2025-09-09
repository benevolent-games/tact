
import {nap, repeat} from "@e280/stz"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Players} from "./parts/player.js"
import {Renderer} from "./parts/renderer.js"
import {GameDeck} from "./parts/game-deck.js"
import {GameController, GameKeyboard, GameStick} from "./parts/controllers.js"

export class Minigame {
	state = new State()
	renderer = new Renderer(this.state)
	logic: Logic

	constructor(public deck: GameDeck) {

		// initialize port modes
		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay", "hub")

		this.logic = new Logic(
			this.state,
			new Players(deck.hub, this.state),
		)

		this.plug(new GameKeyboard())
		// this.plug(new GameStick())

		// autoGamepads(deck.hub.plug)
		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))
	}

	plug(controller: GameController) {
		const port = this.deck.hub.getLonelyPort()
		this.deck.hub.plug(controller)
		return this.logic.players.require(port)
	}

	loop(hz: number) {
		return repeat(async() => {
			await nap(1000 / hz)
			this.logic.tick()
			this.renderer.render()
		})
	}
}

