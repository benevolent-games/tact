
import {GMap, is} from "@e280/stz"
import {Cubby, lazy, Prism, RMap, RSet} from "@e280/strata"

import {Controller} from "./controller.js"
import {remap} from "../../utils/remap.js"
import {DeckState, Id, Profile} from "./types.js"
import {freezeClone} from "../../utils/freeze-clone.js"

export class Deck {
	ports = new RSet<Id>()
	profiles = new RMap<Id, Profile>()
	controllers = new RMap<Id, Controller>()
	portAssignments = new RMap<Id, Id | null>()

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
			profileAssignments: [],
		})

		this.#lens = this.#prism.lens(s => s)
	}

	async load() {
		await this.#prism.set(
			await this.options.store.get() ?? {
				customProfiles: [],
				profileAssignments: [],
			}
		)
	}

	#getCustomProfiles = lazy(() => new GMap(freezeClone(this.#lens.state.customProfiles)))
	#getProfileAssignments = lazy(() => new GMap(freezeClone(this.#lens.state.profileAssignments)))
	#portwise = lazy(() => {
		const map = new GMap<Id, GMap<Id, {controller: Controller, profile: Profile}>>()

		for (const port of this.ports) {
			const results = map.guarantee(port, () => new GMap())

			for (const [controllerId, controller] of this.controllers) {
				const controllerPort = this.portAssignments.get(controllerId) ?? null
				if (controllerPort === port) {
					const profile = this.getProfile(this.profileAssignments.get(controllerId) ?? null)
					results.set(controllerId, {controller, profile})
				}
			}
		}

		return map
	})

	get customProfiles() { return this.#getCustomProfiles() }
	get profileAssignments() { return this.#getProfileAssignments() }
	get portwise() { return this.#portwise() }

	createPort() {
		const id = (this.#nextPortId++).toString(16)
		this.ports.add(id)
		return id
	}

	getProfile(id: string | null) {
		return is.happy(id)
			? this.profiles.get(id) ?? this.customProfiles.get(id) ?? [...this.profiles.values()][0]
			: [...this.profiles.values()][0]
	}

	async connectController(id: Id, controller: Controller, options: {port: Id | null, profileId: Id}) {
		const {port, profileId} = options
		this.controllers.set(id, controller)
		this.portAssignments.set(id, port)
		await this.assignControllerProfile(id, profileId)
	}

	async disconnectController(id: Id) {
		this.controllers.delete(id)
		this.portAssignments.delete(id)
	}

	async setCustomProfile(profileId: Id, profile: Profile) {
		await this.#mut(state => {
			state.customProfiles = remap(state.customProfiles, map => map.set(profileId, profile))
		})
		for (const [cid, pid] of this.profileAssignments)
			if (pid === profileId)
				await this.assignControllerProfile(cid, pid)
	}

	async deleteCustomProfile(id: Id) {
		await this.#mut(state => {
			state.customProfiles = remap(state.customProfiles, map => map.delete(id))
		})
	}

	async assignControllerProfile(controllerId: Id, profileId: Id) {
		const profile = this.getProfile(profileId)
		const controller = this.controllers.need(controllerId)
		controller.bindings = profile.bindings
		await this.#mut(state => {
			state.profileAssignments = remap(state.profileAssignments, map => map.set(controllerId, profileId))
		})
	}

	async #save() {
		await this.options.store.set(this.#prism.get())
	}

	async #mut(fn: (state: DeckState) => void) {
		await this.#lens.mutate(fn)
		await this.#save()
	}
}

