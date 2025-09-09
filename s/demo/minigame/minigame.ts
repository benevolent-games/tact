
import {MapG, nap, repeat} from "@e280/stz"

import {Agent} from "./parts/agent.js"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Player} from "./parts/player.js"
import {Port} from "../../core/port/port.js"
import {Renderer} from "./parts/renderer.js"
import {GameBindings, GameDeck} from "./parts/game-deck.js"
import {Controller} from "../../core/controllers/controller.js"
import {GroupController} from "../../core/controllers/infra/group.js"
import {PointerController} from "../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../core/controllers/standard/keyboard.js"

export class Minigame {
	state = new State()
	renderer = new Renderer(this.state)
	playables = new MapG<Port<GameBindings>, Agent>()
	players = new Set<Player>()
	logic: Logic

	constructor(public deck: GameDeck) {
		// init one agent per port
		for (const port of deck.hub.ports)
			this.playables.set(port, this.state.makeAgent())

		this.plugPlayer(new GroupController(
			new KeyboardController(),
			new PointerController(),
		))

		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))
		// this.plugPlayer(new StickController("stick"))

		this.logic = new Logic(deck, this.state, this.playables)
	}

	plugPlayer(controller: Controller) {
		const {port, unplug} = this.deck.hub.plug(controller)
		const agent = this.playables.require(port)
		agent.alive = true
		const player = new Player(controller, agent, () => {
			agent.alive = false
			unplug()
		})
		this.players.add(player)
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

