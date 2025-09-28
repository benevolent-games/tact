
import {html} from "lit"
import {Bytename} from "@e280/stz"
import {cssReset, view} from "@e280/sly"

import {Deck} from "../../deck.js"
import styleCss from "./style.css.js"
import {DeckComponent} from "../framework.js"
import {Port} from "../../../core/hub/port.js"
import {Profile} from "../../parts/catalog.js"
import {Atom, Bindings, Bracket} from "../../../core/bindings/types.js"

export class DeckBindings extends (
	view(use => (deck: Deck<any>) => {
		use.css(cssReset, styleCss)
		use.attrs.strings.deck = "bindings"
		const {db, hub} = deck

		const catalog = db.$catalog()
		const defaultProfile: Profile = {id: "default", label: "default", bindings: deck.baseBindings}
		const allProfiles = [defaultProfile, ...catalog.profiles.values()]
		const $selectedProfileId = use.signal<string>("default")
		const profile = db.$catalog().getProfile($selectedProfileId()) ?? defaultProfile

		function renderPort(port: Port<Bindings>, index: number) {
			const portProfile = catalog.getProfileForPort(index) ?? defaultProfile
			return html`
				<div class=port>
					<span>port ${index + 1}</span>
					<select>
						${allProfiles.map(profile => html`
							<option
								data-id="${profile.id}"
								?selected="${profile.id === portProfile.id}">
									${profile.label}
							</option>
						`)}
					</select>
				</div>
			`
		}

		function renderBindingBracket([mode, bracket]: [mode: string, bracket: Bracket]) {
			return html`
				<div class=bracket>
					<strong class=mode>${mode}</strong>
					<div>${Object.entries(bracket).map(renderBinds)}</div>
				</div>
			`
		}

		function renderBinds([action, atom]: [action: string, atom: Atom]) {
			return html`
				<div class=bind>
					<span class=action>${action}</span>
				</div>
			`
		}

		const clickClone = async() => {
			const {bindings} = profile
			const label = Bytename.random(4)
			const p = await db.createProfile(label, bindings)
			$selectedProfileId(p.id)
		}

		const deleteProfile = (id: string) => async() => {
			await db.deleteProfile(id)
		}

		const onSelected = (event: InputEvent) => {
			const select = event.target as HTMLSelectElement
			const id = select.value
			$selectedProfileId(id)
		}

		return html`
			<div class=portlist>
				${hub.ports.map(renderPort)}
			</div>

			<div class=bindable>
				<select @input="${onSelected}">
					${allProfiles.map(p => html`
						<option value="${p.id}" ?selected="${p.id === profile.id}">${p.label}</option>
					`)}
				</select>
				<button @click="${clickClone}">clone</button>
				<button ?disabled="${profile.id === defaultProfile.id}" @click="${deleteProfile(profile.id)}">delete</button>
				<div class=bindings>
					${Object.entries(profile.bindings).map(renderBindingBracket)}
				</div>
			</div>
		`
	})
	.component(DeckComponent)
	.props(el => [el.deck])
) {}

