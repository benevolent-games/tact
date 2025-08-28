
import {Vec2} from "@benev/math"

export function make_pointer_listeners({
		set_vector,
		set_pointer_position,
	}: {
		set_vector: (vector: Vec2) => void
		set_pointer_position: (position: Vec2) => void
	}) {

	let pointer_id: number | undefined

	return {
		pointerdown: {
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()

				const element = event.currentTarget as HTMLElement

				if (pointer_id)
					element.releasePointerCapture(pointer_id)

				pointer_id = event.pointerId
				element.setPointerCapture(pointer_id)
				set_pointer_position(Vec2.new(event.clientX, event.clientY))
				set_vector(Vec2.zero())
			},
		},

		pointermove: {
			passive: false,
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()

				if (event.pointerId === pointer_id)
					set_pointer_position(Vec2.new(event.clientX, event.clientY))
			},
		},

		pointerup: {
			handleEvent: (event: PointerEvent) => {
				event.preventDefault()
				pointer_id = undefined
				set_vector(Vec2.zero())
			},
		},
	}
}

