
import {html} from "lit"
import {shadow} from "@e280/sly"
import {Deck} from "../../deck/deck.js"
import {Id, Profile} from "../../deck/types.js"

export const DeskView = shadow((deck: Deck) => {

	function ControllerSettings(controllerId: Id, profile: Profile) {
		const selectedProfileId = deck.profileAssignments.need(controllerId)

		async function onChange(event: Event) {
			const element = event.currentTarget as HTMLSelectElement
			const profileId = element.value
			await deck.assignControllerProfile(controllerId, profileId)
		}

		return html`
			<div class=controller>
				<span>${controllerId}</span>
				<span>${profile.label}</span>
				<label>
					<span>bindings</span>
					<select .value="${selectedProfileId}" @change="${onChange}">
						${deck.profiles.array().map(([profileId, profile]) => html`
							<option value="${profileId}">${profile.label}</option>
						`)}
					</select>
				</label>
			</div>
		`
	}

	return html`
		<div class=deck>
			${deck.portwise.array().map(([,controllers], portIndex) => html`
				<div class=port>
					<strong>P${portIndex + 1}</strong>
					<div class=controllerlist>
						${controllers.array().map(
							([controllerId, {controller, profile}]) =>
								ControllerSettings(controllerId, profile)
						)}
					</div>
				</div>
			`)}
		</div>
	`
})

