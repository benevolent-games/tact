
import {dom, view} from "@e280/sly"
import {styles} from "./styles.js"

const NubLookpadView = view(use => () => {
	use.name("nub-lookpad")
	use.styles(styles)

	const $captured = use.signal<number | undefined>(undefined)

	use.mount(() => dom.events(use.element, {
		pointerdown: (event: PointerEvent) => {
			event.preventDefault()
			if ($captured.value)
				use.element.releasePointerCapture($captured.value)

			use.element.setPointerCapture(event.pointerId)
			$captured.value = event.pointerId
			// onPointerDrag(event)
		},

		pointermove: [{passive: false}, (event: PointerEvent) => {
			event.preventDefault()
			if (event.pointerId === $captured.value) {
				// onPointerDrag(event)
			}
		}],

		pointerup: (event: PointerEvent) => {
			event.preventDefault()
			if (event.pointerId === $captured.value) {
				use.element.releasePointerCapture($captured.value)
				$captured.value = undefined
				// onPointerDrag(event)
			}
		},
	}))
})

export class NubLookpad extends (
	NubLookpadView
		.component()
		.props(() => [])
) {}

