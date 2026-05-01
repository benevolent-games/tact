
import {Cubby, RMap, RSet} from "@e280/strata"
import {Controller} from "./controller.js"
import {Profiles} from "./parts/profiles.js"
import {Settings} from "./parts/settings.js"
import {DeckState, Id, Profile} from "./types.js"

export class Deck {
	profiles
	settings
	ports = new RSet<Id>()
	controllers = new RMap<Id, Controller>()
	portAssignments = new RMap<Id, Id | undefined>()
	#nextPortId = 1

	constructor(options: {
			store: Cubby<DeckState>
			stockProfiles: Record<Id, Profile>
		}) {
		this.settings = new Settings(options.store)
		this.profiles = new Profiles(options.stockProfiles, this.settings.customProfiles)
	}

	async load() {
		await this.settings.load()
		for (const id of this.controllers.keys())
			this.#applyControllerProfile(id)
	}

	createPort() {
		const id = (this.#nextPortId++).toString(16)
		this.ports.add(id)
		return id
	}

	async connectController(id: Id, controller: Controller) {
		this.controllers.set(id, controller)
		this.#applyControllerProfile(id)
	}

	async disconnectController(id: Id) {
		this.controllers.delete(id)
		this.portAssignments.delete(id)
	}

	async plug(controllerId: string, port: string) {
		this.portAssignments.set(controllerId, port)
	}

	async unplug(controllerId: string) {
		this.portAssignments.delete(controllerId)
	}

	async assignControllerProfile(controllerId: Id, profileId: Id) {
		this.settings.profileAssignments.set(controllerId, profileId)
		this.#applyControllerProfile(controllerId)
		await this.settings.save()
	}

	getAllControllersOnPort(id: Id) {
		return [...this.portAssignments]
			.filter(([,portId]) => portId === id)
			.map(([controllerId]) => controllerId)
	}

	queryController(id: Id) {
		const controller = this.controllers.need(id)
		const port = this.portAssignments.get(id)
		const profileId = this.settings.profileAssignments.get(id)
		const profile = this.profiles.get(profileId)
		return {id, controller, port, profileId, profile}
	}

	#applyControllerProfile(controllerId: Id) {
		const controller = this.controllers.need(controllerId)
		const profileId = this.settings.profileAssignments.get(controllerId)
		controller.bindings = this.profiles.get(profileId).bindings
	}
}

