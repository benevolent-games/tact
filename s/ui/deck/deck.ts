
import {GMap, is} from "@e280/stz"
import {Cubby, lazy, Prism, RMap, RSet} from "@e280/strata"

import {Device} from "../../core/types.js"
import {mapOp} from "../../utils/map-op.js"
import {DeckState, Id, Profile} from "./types.js"
import {freezeClone} from "../../utils/freeze-clone.js"

export class Deck {
	profiles = new RMap<Id, Profile>()
	ports = new RSet<Id>()
	devices = new RMap<Id, Device>()
	devicesToPorts = new RMap<Id, Id | null>()

	#prism
	#lens
	#nextPortId

	constructor(private options: {
			store: Cubby<DeckState>
			profiles: Record<Id, Profile>
		}) {

		this.#nextPortId = 0

		for (const [id, profile] of Object.entries(options.profiles))
			this.profiles.set(id, profile)

		this.#prism = new Prism<DeckState>({
			customProfiles: [],
			devicesToProfiles: [],
		})

		this.#lens = this.#prism.lens(s => s)
	}

	async load() {
		await this.#prism.set(
			await this.options.store.get() ?? {
				customProfiles: [],
				devicesToProfiles: [],
			}
		)
	}

	addPort() {
		const id = (this.#nextPortId++).toString(16)
		this.ports.add(id)
		return id
	}

	getProfile(id: string | null) {
		return is.happy(id)
			? this.profiles.get(id) ?? this.customProfiles.get(id) ?? [...this.profiles.values()][0]
			: [...this.profiles.values()][0]
	}

	#$portwise = lazy(() => {
		const map = new GMap<Id, GMap<Id, {device: Device, profile: Profile}>>()

		for (const port of this.ports) {
			const devices = map.guarantee(port, () => new GMap())
			for (const [deviceId, device] of this.devices) {
				const devicePort = this.#validPort(this.devicesToPorts.get(deviceId) ?? null)
				if (devicePort !== port) continue
				const profile = this.getProfile(this.devicesToProfiles.get(deviceId) ?? null)
				devices.set(deviceId, {device, profile})
			}
		}

		return map
	})

	get portwise() {
		return this.#$portwise()
	}

	async setDevice(options: {id: Id, device: Device, port: Id | null, profileId: Id}) {
		const {id, device, port, profileId} = options
		this.devices.set(id, device)
		this.devicesToPorts.set(id, this.#validPort(port))
		await this.#mut(state => {
			state.devicesToProfiles = mapOp(state.devicesToProfiles, map => map.set(id, this.#validProfileId(profileId)))
		})
	}

	async deleteDevice(id: Id) {
		this.devices.delete(id)
		this.devicesToPorts.delete(id)
		await this.#mut(state => {
			state.devicesToProfiles = mapOp(state.devicesToProfiles, map => map.delete(id))
		})
	}

	#$customProfiles = lazy(() => {
		return new GMap(freezeClone(this.#lens.state.customProfiles))
	})

	#$devicesToProfiles = lazy(() => {
		return new GMap(freezeClone(this.#lens.state.devicesToProfiles))
	})

	get customProfiles() {
		return this.#$customProfiles()
	}

	get devicesToProfiles() {
		return this.#$devicesToProfiles()
	}

	async setCustomProfile(id: Id, profile: Profile) {
		await this.#mut(state => {
			state.customProfiles = mapOp(state.customProfiles, map => map.set(id, profile))
		})
	}

	async deleteCustomProfile(id: Id) {
		await this.#mut(state => {
			state.customProfiles = mapOp(state.customProfiles, map => map.delete(id))
		})
	}

	async #save() {
		await this.options.store.set(this.#prism.get())
	}

	async #mut(fn: (state: DeckState) => void) {
		await this.#lens.mutate(fn)
		await this.#save()
	}

	#validPort(port: string | null) {
		return (is.happy(port) && this.ports.has(port))
			? port
			: null
	}

	#validProfileId(id?: string) {
		return (is.happy(id) && (this.profiles.has(id) || this.customProfiles.has(id)))
			? id
			: null
	}
}

