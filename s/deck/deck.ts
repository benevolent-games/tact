
import {Kv} from "@e280/kv"
import {disposer, ob, range} from "@e280/stz"

import {Db} from "./parts/db.js"
import {Hub} from "../core/hub/hub.js"
import {Port} from "../core/hub/port.js"
import {Bindings} from "../core/bindings/types.js"
import {mergeBindings} from "./parts/merge-bindings.js"
import {MetaBindings, metaMode} from "../core/hub/types.js"
import {autoGamepads} from "../core/devices/auto-gamepads.js"
import {DeckOverlay} from "./views/deck-overlay/component.js"
import {makeMetaBindings} from "../core/hub/meta-bindings.js"
import {DeviceSkins} from "./parts/device-skins/device-skin.js"
import {OverlayVisibility} from "./parts/overlay-visibility.js"
import {PrimaryDevice} from "../core/devices/standard/primary.js"
import { dom } from "@e280/sly"

export type DeckOptions<B extends Bindings, MB extends MetaBindings = any> = {
	kv: Kv
	bindings: B
	portCount: number
	metaBindings?: MB
}

export class Deck<B extends Bindings, MB extends MetaBindings = any> {
	static async load<B extends Bindings, MB extends MetaBindings = any>(options: DeckOptions<B, MB>) {
		const db = await Db.load(options.kv.store("catalog"))

		const ports = range(options.portCount)
			.map(index => db.$catalog().getProfileForPort(index))
			.map(profile => mergeBindings(options.bindings, profile?.bindings))
			.map(bindings => new Port<B>(bindings as B))

		const hub = new Hub<B>(
			ports,
			db.$catalog().metaBindings
				?? options.metaBindings
				?? makeMetaBindings(),
		)

		return new this(hub, db)
	}

	dispose = disposer()
	deviceSkins = new DeviceSkins()
	overlayVisibility: OverlayVisibility
	primaryDevice = new PrimaryDevice()

	views = ob({DeckOverlay}).map(fn => fn(this))
	components = ob(this.views).map(v => v.component().props(_c => []))

	registerComponents() {
		dom.register(this.components)
	}

	constructor(
			public hub: Hub<B, MB>,
			public db: Db,
		) {

		this.overlayVisibility = new OverlayVisibility(hub, this.deviceSkins)

		// meta reveal overlay
		this.dispose.schedule(
			hub.metaPort.actions[metaMode].revealOverlay.on(action => {
				if (action.pressed)
					this.overlayVisibility.bump()
			})
		)
	}

	get catalog() {
		return this.db.$catalog()
	}
}

