
import {dom, shadow, useHost, useMount, useName, useSignal, useStyles} from "@e280/sly"
import {styles} from "./styles.js"

export const NubLookpad = shadow(() => {
	useName("nub-lookpad")
	useStyles(styles)
	const host = useHost()

	const $captured = useSignal<number | undefined>(undefined)

	useMount(() => dom.events(host, {
		pointerdown: (event: PointerEvent) => {
			event.preventDefault()
			if ($captured.value)
				host.releasePointerCapture($captured.value)

			host.setPointerCapture(event.pointerId)
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
				host.releasePointerCapture($captured.value)
				$captured.value = undefined
				// onPointerDrag(event)
			}
		},
	}))
})
