
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Deck} from "../../../hub/deck.js"
import {Configurator} from "../../configurator.js"

export const ControlsView = shadow((
		deck: Deck<any>,
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

