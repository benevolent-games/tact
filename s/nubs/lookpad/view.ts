
import {html} from "lit"
import {view} from "@e280/sly"

import {styles} from "./styles.js"
import {lookpad_listeners} from "./utils/listeners.js"

export const NubLookpad = view(use => () => {
	use.name("nub-lookpad")
	use.styles(styles)

	const pad = use.life(() => {
		const pad = document.createElement("div")
		pad.className = "pad"

		const listeners = lookpad_listeners({
			getPointerCaptureElement: () => pad,
			onPointerDrag: () => {},
		})

		for (const [event, {handleEvent, options}] of Object.entries(listeners))
			pad.addEventListener(event as any, handleEvent, options)

		return [pad, () => {
			for (const [event, {handleEvent}] of Object.entries(listeners))
				pad.removeEventListener(event as any, handleEvent)
		}]
	})

	return html`${pad}`
})

