
import {nap, repeat} from "@e280/stz"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Players} from "./parts/player.js"
import {Renderer} from "./parts/renderer.js"
import {Deck} from "../../core/deck/deck.js"
import {gameBindings, GameDeck} from "./parts/game-bindings.js"
import {localStorageKv} from "../../core/deck/parts/local-storage-kv.js"
import {Device, KeyboardDevice, VirtualDevice} from "./parts/devices.js"

export class Game {
	static async load() {
		return new this(await Deck.load({
			portCount: 4,
			kv: localStorageKv(),
			bindings: gameBindings,
		}))
	}

	state = new State()
	renderer = new Renderer(this.state)
	logic: Logic

	constructor(public deck: GameDeck) {

		// initialize port modes
		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay")

		this.logic = new Logic(
			this.state,
			new Players(deck.hub, this.state),
		)

		this.plug(new KeyboardDevice())
		this.plug(new VirtualDevice(deck.hub))
	}

	plug(device: Device) {
		const port = this.deck.hub.getLonelyPort()
		this.deck.hub.plug(device)
		return this.logic.players.require(port)
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

