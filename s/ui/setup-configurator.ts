
import {LocalStore} from "@e280/strata"
import {Profile} from "./types.js"
import {Configurator} from "./configurator.js"

export async function setupConfigurator({stockProfiles}: {
		stockProfiles: Profile[]
	}) {
	const store = new LocalStore("tactConfigurator")
	const configurator = new Configurator({
		store,
		stockProfiles,
		preferences: {
			customProfiles: [],
			inputSettings: [],
		},
	})
	const dispose = store.onStorageEvent(() => configurator.load())
	await configurator.load()
	return {configurator, dispose}
}

