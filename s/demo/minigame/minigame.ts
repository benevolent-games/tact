
import {MapG, nap, repeat} from "@e280/stz"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Renderer} from "./parts/renderer.js"
import {GameDeck} from "./parts/game-deck.js"
import {Controller} from "../../core/controllers/controller.js"
import {GroupController} from "../../core/controllers/infra/group.js"
import {PointerController} from "../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../core/controllers/standard/keyboard.js"

export class Mechanism {
	constructor(
		public label: string,
		public controller: Controller,
	) {}
}

export class Minigame {
	state = new State()
	renderer = new Renderer(this.state)
	mechanisms = new MapG<Controller, Mechanism>()
	logic: Logic

	constructor(public deck: GameDeck) {
		this.logic = new Logic(deck, this.state)

		const mechanism = new Mechanism(
			"keyboard",
			new GroupController(
				new KeyboardController(),
				new PointerController(),
			),
		)

		this.plugPlayer(mechanism.controller)
		this.mechanisms.set(mechanism.controller, mechanism)

		// autoGamepads(deck.hub.plug)
		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))
	}

	plugPlayer(controller: Controller) {
		const port = this.deck.hub.getLonelyPort()
		this.deck.hub.plug(controller)
		const player = this.logic.players.require(port)
		player.agent.alive = true
		return player
	}

	loop(hz: number) {
		return repeat(async() => {
			await nap(1000 / hz)
			this.logic.tick()
			this.renderer.render()
		})
	}
}

