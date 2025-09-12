
import {signal} from "@e280/strata"
import {debounce, disposer} from "@e280/stz"
import {Hub} from "../../../core/hub/hub.js"
import {DeviceSkins} from "../../commons/device-skins/device-skin.js"

export class PortsControl {
	autohide = true
	dispose = disposer()
	#created = Date.now()
	#$auto = signal(false)

	/** manual override for whether the prots view should be visible */
	readonly $active = signal(false)

	/** derived signal about whether the ports view should be visible */
	readonly $show = signal.derived(() => (
		this.$active() || (this.autohide && this.#$auto())
	))

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

	#autoOff = debounce(3000, () => this.#$auto(false))

	async bump() {
		await this.#$auto(true)
		await this.#autoOff()
	}

	async activate() {
		return this.$active.set(true)
	}

	async deactivate() {
		return this.$active.set(true)
	}
}

