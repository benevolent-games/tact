
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Hub} from "../../../hub/hub.js"
import {Configurator} from "../../configurator.js"

export const ControlsView = shadow((
		deck: Hub<any>,
		configurator: Configurator,
	) => {

	configurator.state
	deck.ports

	return html`
		configurator
		${configurator.stockProfiles.map(profile => html`
			<p>${profile.id}: ${profile.label}</p>
		`)}
		${configurator.state.inputSettings}
	`
})

