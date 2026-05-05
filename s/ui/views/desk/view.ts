
import {html} from "lit"
import {Content, shadow} from "@e280/sly"

import {Deck} from "../../deck/deck.js"
import {Port} from "../../deck/port.js"
import {Controller} from "../../deck/controller.js"

export type DeskOptions = {
	labels?: Map<any, Content>
}

export const DeskView = shadow((deck: Deck, options: DeskOptions = {}) => {
	const {labels = new Map()} = options

	function PortView(port: Port, portIndex: number) {
		return html`
			<div class=port>
				<strong>P${portIndex + 1}</strong>
				<div class=controllerlist>
					${port.controllers.map(ControllerView)}
				</div>
			</div>
		`
	}

	function ControllerView(controller: Controller) {
		const info = deck.queryController(controller)

		async function onChange(event: Event) {
			const element = event.currentTarget as HTMLSelectElement
			const profileKey = element.value
			await deck.assignControllerProfile(controller, profileKey)
		}

		return html`
			<div class=controller>
				<span>${labels.get(controller) ?? controller.handle}</span>
				<select @change=${onChange}>
					${deck.profiles.all.map(([profileId, profile]) => html`
						<option
							.value=${profileId}
							.selected=${profileId === info.profileKey}>
							${profile.label}
						</option>
					`)}
				</select>
			</div>
		`
	}

	return html`
		<div class=deck>
			${deck.ports.map(PortView)}
		</div>
	`
})

