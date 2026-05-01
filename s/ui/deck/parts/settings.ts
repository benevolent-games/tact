
import {Cubby} from "@e280/strata"
import {DeckState, Id, Profile} from "../types.js"
import {ReactiveMap} from "../../../utils/reactive.js"
import {shiftLimit} from "../../../utils/shift-limit.js"

const limit = 256

export class Settings {
	profileAssignments = new ReactiveMap<Id, Id>()
	customProfiles = new ReactiveMap<Id, Profile>()

	constructor(private store: Cubby<DeckState>) {}

	async save() {
		await this.store.set({
			customProfiles: shiftLimit(limit, this.customProfiles.array()),
			profileAssignments: shiftLimit(limit, this.profileAssignments.array()),
		})
	}

	async load() {
		const state = await this.store.get()
		await this.customProfiles.clear()
		await this.profileAssignments.clear()
		await this.customProfiles.setEntries(state?.customProfiles ?? [])
		await this.profileAssignments.setEntries(state?.profileAssignments ?? [])
	}
}

