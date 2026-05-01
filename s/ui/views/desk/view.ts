
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Id} from "../../deck/types.js"
import {Deck} from "../../deck/deck.js"
import {Controller} from "../../deck/controller.js"

export const DeskView = shadow((deck: Deck) => {
	function ControllerView(controllerId: Id, _controller: Controller) {
		const selectedProfileId = deck.profiles.normalizeId(deck.settings.profileAssignments.get(controllerId))
		const selectedProfile = deck.profiles.get(selectedProfileId)

		async function onChange(event: Event) {
			const element = event.currentTarget as HTMLSelectElement
			const profileId = element.value
			await deck.assignControllerProfile(controllerId, profileId)
		}

		return html`
			<div class=controller>
				<span>${controllerId}</span>
				<span>${selectedProfile.label}</span>
				<label>
					<span>bindings</span>
					<select @change=${onChange}>
						${deck.profiles.all.map(([profileId, profile]) => html`
							<option .value=${profileId} .selected=${profileId === selectedProfileId}>${profile.label}</option>
						`)}
					</select>
				</label>
			</div>
		`
	}

	return html`
		<div class=deck>
			${deck.ports.array().map((portId, portIndex) => {
				const controllers = deck.controllers.array()
					.filter(([controllerId]) => deck.portAssignments.get(controllerId) === portId)

				return html`
					<div class=port>
						<strong>P${portIndex + 1}</strong>
						<div class=controllerlist>
							${controllers.map(([controllerId, controller]) => ControllerView(controllerId, controller))}
						</div>
					</div>
				`
			})}
		</div>
	`
})

