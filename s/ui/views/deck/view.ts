
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Hub} from "../../../hub/hub.js"
import {Director} from "../../director.js"

export const DeckView = shadow((
		hub: Hub<any>,
		director: Director,
	) => {

	director.state
	hub.ports

	return html`
		ports
		${director.stockProfiles.map(profile => html`
			<p>${profile.id}: ${profile.label}</p>
		`)}
		${director.state.controllerSettings}
	`
})

