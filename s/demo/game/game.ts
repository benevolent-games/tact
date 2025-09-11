
import {disposer, nap, repeat} from "@e280/stz"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Players} from "./parts/player.js"
import {Renderer} from "./parts/renderer.js"
import {Deck} from "../../core/deck/deck.js"
import {Controller} from "../../core/controllers/controller.js"
import {gameBindings, GameDeck} from "./parts/game-bindings.js"
import {CompositeDevice, VirtualDevice} from "./parts/devices.js"
import {autoGamepads} from "../../core/controllers/auto-gamepads.js"
import {localStorageKv} from "../../core/deck/parts/local-storage-kv.js"

export class Game {
	static async load() {
		return new this(await Deck.load({
			portCount: 4,
			kv: localStorageKv(),
			bindings: gameBindings,
		}))
	}

	dispose = disposer()
	state = new State()
	renderer = new Renderer(this.state)
	logic: Logic

	constructor(public deck: GameDeck) {

		// initialize port modes
		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay")

		// establish game logic
		this.logic = new Logic(
			this.state,
			new Players(deck.hub, this.state),
		)

		// plug in initial devices
		this.plug(new CompositeDevice())
		this.plug(new VirtualDevice(deck.hub))

		// on hub update, set agent.alive based on port status
		this.dispose.schedule(
			this.deck.hub.on(() => {
				for (const player of this.logic.players)
					player.agent.alive = player.port.controllers.size > 0
			})
		)

		// dynamically plug in detected gamepads
		this.dispose.schedule(
			autoGamepads(deck.hub.plug)
		)
	}

	plug(device: Controller) {
		this.deck.hub.plug(device)
		return () => this.unplug(device)
	}

	unplug(device: Controller) {
		this.deck.hub.unplug(device)
	}

	loop(hz: number) {
		return repeat(async() => {
			await nap(1000 / hz)
			this.deck.hub.poll()
			this.logic.tick()
			this.renderer.render()
		})
	}
}

