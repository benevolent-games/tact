
import {html} from "lit"
import {Content, shadow} from "@e280/sly"
import {Id} from "../../deck/types.js"
import {Deck} from "../../deck/deck.js"
import {Controller} from "../../deck/controller.js"

export type DeskOptions = {
	labels?: Map<any, Content>
}

export const DeskView = shadow((deck: Deck, options: DeskOptions = {}) => {
	const {labels = new Map()} = options

	function PortView(portId: Id, portIndex: number) {
		return html`
			<div class=port>
				<strong>P${portIndex + 1}</strong>
				<div class=controllerlist>
					${deck.controllers.array()
						.filter(([controllerId]) => deck.portAssignments.get(controllerId) === portId)
						.map(([controllerId, controller]) => ControllerView(controllerId, controller))}
				</div>
			</div>
		`
	}

	function ControllerView(controllerId: Id, controller: Controller) {
		const selectedProfileId = deck.profiles.normalizeId(
			deck.settings.profileAssignments.get(controllerId)
		)

		async function onChange(event: Event) {
			const element = event.currentTarget as HTMLSelectElement
			const profileId = element.value
			await deck.assignControllerProfile(controllerId, profileId)
		}

		return html`
			<div class=controller>
				<span>${labels.get(controller) ?? controllerId}</span>
				<select @change=${onChange}>
					${deck.profiles.all.map(([profileId, profile]) => html`
						<option
							.value=${profileId}
							.selected=${profileId === selectedProfileId}>
							${profile.label}
						</option>
					`)}
				</select>
			</div>
		`
	}

	return html`
		<div class=deck>
			${deck.ports.array().map(PortView)}
		</div>
	`
})

