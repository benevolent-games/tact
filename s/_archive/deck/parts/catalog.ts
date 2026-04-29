
import {deep, MapG} from "@e280/stz"
import {MetaBindings} from "../../core/hub/types.js"
import {Bindings} from "../../core/bindings/types.js"

export type Profile = {
	id: string
	label: string
	bindings: Bindings
}

export type CatalogData = {
	profiles: Profile[]
	portProfiles: (string | null)[]
	metaBindings: MetaBindings | null
}

export class Catalog {
	profiles = new MapG<string, Profile>()
	portProfiles: (string | null)[] = []
	metaBindings: MetaBindings | null = null

	constructor(data?: CatalogData) {
		if (data) {
			for (const profile of data.profiles)
				this.profiles.set(profile.id, profile)

			this.portProfiles = data.portProfiles
				.map(id => id && (this.profiles.has(id) ?id :null))

			this.metaBindings = data.metaBindings
		}
	}

	toJSON(): CatalogData {
		return deep.clone({
			profiles: [...this.profiles.values()],
			portProfiles: this.portProfiles,
			metaBindings: this.metaBindings,
		})
	}

	clone() {
		return new Catalog(this.toJSON())
	}

	getProfile(profileId: string) {
		return this.profiles.get(profileId)
	}

	getProfileForPort(portIndex: number) {
		const profileId = this.portProfiles.at(portIndex)
		return profileId
			? this.getProfile(profileId)
			: undefined
	}
}

