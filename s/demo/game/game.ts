
import {disposer, nap, repeat} from "@e280/stz"
import {Logic} from "./parts/logic.js"
import {State} from "./parts/state.js"
import {Deck} from "../../deck/deck.js"
import {Players} from "./parts/player.js"
import {Renderer} from "./parts/renderer.js"
import {Device} from "../../core/devices/device.js"
import {VirtualDevice} from "./parts/virtual-device.js"
import {gameBindings, GameDeck} from "./parts/game-bindings.js"
import {autoGamepads} from "../../core/devices/auto-gamepads.js"
import {localStorageKv} from "../../deck/parts/local-storage-kv.js"
import {PrimaryDevice} from "../../core/devices/standard/primary.js"

export class Game {
	static async load() {
		return new this(
			await Deck.load({
				portCount: 4,
				kv: localStorageKv(),
				bindings: gameBindings,
			})
		)
	}

	logic: Logic
	dispose = disposer()
	state = new State()
	renderer = new Renderer(this.state)

	constructor(public deck: GameDeck) {

		// add an icon for our demo virtual device
		this.deck.deviceSkins.icons.add(
			[VirtualDevice, "🔘"],
		)

		// initialize port modes
		for (const port of this.deck.hub.ports)
			port.modes.adds("gameplay")

		// establish game logic
		this.logic = new Logic(
			this.state,
			new Players(deck.hub, this.state),
		)

		// on hub update, set agent.alive based on port status
		this.dispose.schedule(
			this.deck.hub.on(() => {
				for (const player of this.logic.players) {
					player.agent.alive = player.port.devices.size > 0
					const [firstDevice] = player.port.devices
					player.agent.color = firstDevice
						? this.deck.deviceSkins.get(firstDevice).color
						: "#444"
				}
			})
		)

		// plug in initial devices
		this.plug(new PrimaryDevice())
		this.plug(new VirtualDevice(deck.hub))

		// dynamically plug in detected gamepads
		this.dispose.schedule(
			autoGamepads(deck.hub.plug)
		)
	}

	plug(device: Device) {
		this.deck.hub.plug(device)
		return () => this.unplug(device)
	}

	unplug(device: Device) {
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

