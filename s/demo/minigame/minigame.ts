
import {MapG, nap, repeat} from "@e280/stz"

import {Agent} from "./parts/agent.js"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Player} from "./parts/player.js"
import {Port} from "../../core/port/port.js"
import {Renderer} from "./parts/renderer.js"
import {GameDeck} from "./parts/load-deck.js"
import {Controller} from "../../core/controllers/controller.js"
import {GroupController} from "../../core/controllers/infra/group.js"
import {StickController} from "../../core/controllers/standard/stick.js"
import {PointerController} from "../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../core/controllers/standard/keyboard.js"

export class Minigame {
	state = new State()
	renderer = new Renderer(this.state)
	agents = new MapG<Port<any>, Agent>()
	players = new Set<Player>()
	logic: Logic

	constructor(public deck: GameDeck) {
		this.logic = new Logic(deck, this.agents)

		// init one agent per port
		for (const port of deck.hub.ports)
			this.agents.set(port, this.state.makeAgent())

		this.plugPlayer(new GroupController(
			new KeyboardController(),
			new PointerController(),
		))
		this.plugPlayer(new StickController("stick"))
		this.plugPlayer(new StickController("stick"))
		this.plugPlayer(new StickController("stick"))
	}

	plugPlayer(controller: Controller) {
		const {port, unplug} = this.deck.hub.plug(controller)
		const agent = this.agents.require(port)
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

