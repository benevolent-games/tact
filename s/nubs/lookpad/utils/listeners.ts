
export function lookpad_listeners({
		onPointerDrag,
		getPointerCaptureElement,
	}: {
		onPointerDrag: (event: PointerEvent) => void
		getPointerCaptureElement: () => HTMLElement
	}) {

	let pointer_id: number | undefined

	return {
		pointerdown: {
			options: undefined,
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()

				const element = getPointerCaptureElement()

				if (pointer_id)
					element.releasePointerCapture(pointer_id)

				pointer_id = event.pointerId
				element.setPointerCapture(pointer_id)
				onPointerDrag(event)
			},
		},

		pointermove: {
			options: {passive: false},
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()

				if (event.pointerId === pointer_id)
					onPointerDrag(event)
			},
		},

		pointerup: {
			options: undefined,
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()

				if (event.pointerId === pointer_id) {
					getPointerCaptureElement().releasePointerCapture(pointer_id)
					pointer_id = undefined
					onPointerDrag(event)
				}
			},
		},
	}
}

