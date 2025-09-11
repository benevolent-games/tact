
import {html} from "lit"
import {dom, view} from "@e280/sly"
import {coalesce, nap} from "@e280/stz"
import {Scalar, Vec2} from "@benev/math"

import {style} from "./style.js"
import {SchtickController} from "./controller.js"
import {circularClamp} from "../../utils/circular-clamp.js"

export const Schtick = view(use => ({$vector}: SchtickController) => {
	use.name("nub-stick")
	use.css(style)

	const range = new Vec2(0.2, 0.2)

	use.mount(() => {
		let pointerId: number | undefined

		function recalc(event: PointerEvent) {
			const rect = use.element.getBoundingClientRect()
			const vector = $vector.get()
			vector.x = Scalar.remap(event.clientX, rect.left, rect.right, -1, 1)
			vector.y = Scalar.remap(event.clientY, rect.top, rect.bottom, -1, 1)
			vector.set(circularClamp(vector, range))
			$vector.publish()
		}

		function release() {
			if (pointerId === undefined) return
			$vector.get().set_(0, 0)
			$vector.publish()

			// fix for ridiculous firefox bug,
			// where our captured pointerup was clicking outside buttons
			nap(0).then(() => {
				if (pointerId === undefined) return
				use.element.releasePointerCapture(pointerId)
				pointerId = undefined
			})
		}

		return coalesce(

			// fix for ridiculous firefox bug
			dom.events(document.body, {
				click: [{capture: true}, (event: Event) => {
					if (pointerId === undefined) return
					event.preventDefault()
					event.stopPropagation()
				}],
			}),

			dom.events(use.element, {
				pointerdown: (event: PointerEvent) => {
					if (pointerId === undefined) {
						pointerId = event.pointerId
						use.element.setPointerCapture(pointerId)
						recalc(event)
					}
				},
				pointermove: [{}, (event: PointerEvent) => {
					if (pointerId !== undefined)
						recalc(event)
				}],
				pointerup: release,
				pointercancel: release,
			})
		)
	})

	const vector = $vector.get()
	const innerstyle = `width: ${range.x * 100}%;`
	const outerstyle = `width: ${100 - (range.y * 100)}%;`

	const framestyle = (factor: number) => {
		const f = factor * 0.5
		const x = f * vector.x * 100
		const y = f * vector.y * 100
		return `
			transform-origin: center center;
			transform: translate(${x}%, ${y}%);
		`
	}

	return html`
 		<div class="frame inner">
 			<div style="${innerstyle}"></div>
 		</div>

 		<div class="frame outer">
 			<div style="${outerstyle}"></div>
 		</div>

 		<div class="frame stickbase">
 			<div></div>
 		</div>

 		<div class="frame stickunder" style="${framestyle(0.5)}">
 			<div></div>
 		</div>

 		<div class="frame stick" style="${framestyle(1.0)}">
 			<div></div>
 		</div>
	`
})

