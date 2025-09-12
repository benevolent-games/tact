
import {signal} from "@e280/strata"
import {debounce, disposer} from "@e280/stz"
import {Hub} from "../../core/hub/hub.js"
import {DeviceSkins} from "./device-skins/device-skin.js"

export class OverlayVisibility {
	auto = true
	dispose = disposer()

	#created = Date.now()
	#$auto = signal(false)

	/** manual override for whether the ports view should be visible */
	readonly $manual = signal(false)

	/** derived signal about whether the ports view should be visible */
	readonly $visible = signal.derived(() => (
		this.$manual() || (this.auto && this.#$auto())
	))

	/** whether or not to show labels in the overlay ui */
	readonly $showLabels = signal(false)

	constructor(
			public hub: Hub<any>,
			public deviceSkins = new DeviceSkins(),
		) {

		this.dispose.schedule(
			hub.on(async() => {
				const since = Date.now() - this.#created
				if (since > 100) await this.bump()
			})
		)
	}

	#autoOff = debounce(1500, () => this.#$auto(false))

	async bump() {
		await this.#$auto(true)
		await this.#autoOff()
	}

	async toggle(active = !this.$manual()) {
		return this.$manual.set(active)
	}
}

