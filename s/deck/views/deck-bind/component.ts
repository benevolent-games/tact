
import {BaseElement, cssReset, dom, view} from "@e280/sly"
import {dc} from "../framework.js"
import {Deck} from "../../deck.js"
import styleCss from "./style.css.js"
import {Atom} from "../../../core/bindings/types.js"

export const DeckBind = dc(deck => class extends (
	view(use => (
			portIndex: number,
			mode: string | undefined,
			action: string | undefined,
		) => {

		use.styles(cssReset, styleCss)
		use.attrs.string.deck = "bind"

		if (!mode || !action)
			return null

		const atom: Atom | undefined = (
			deck.hub.ports[portIndex]?.bindings[mode]?.[action]
		)

		return JSON.stringify(atom)
	})

	.component(class extends BaseElement {
		attrs = dom.attrs(this).spec({
			"port-index": Number,
			"mode": String,
			"action": String,
		})
	})

	.props(el => [
		el.attrs["port-index"] ?? 0,
		el.attrs["mode"],
		el.attrs["action"],
	])
) {})

