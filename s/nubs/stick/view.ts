
import {html} from "lit"
import {view} from "@e280/sly"
import {Vec2} from "@benev/math"

import {styles} from "./styles.js"
import {Basis} from "../stick-graphic/types/basis.js"
import {NubStickGraphic} from "../stick-graphic/view.js"
import {StickController} from "../../core/controllers/standard/stick.js"
import {make_pointer_listeners} from "./utils/make_pointer_listeners.js"
import {calculate_new_vector_from_pointer_position} from "./utils/calculate_new_vector_from_pointer_position.js"

export const NubStick = view(use => (stick: StickController) => {
	use.name("nub-stick")
	use.styles(styles)

	let basis: Basis | undefined = undefined
	const updateBasis = (b: Basis) => basis = b

	const listeners = use.once(() => make_pointer_listeners({
		set_vector: vector => stick.vector.value = vector,
		set_pointer_position: position => {
			if (basis)
				stick.vector.value = calculate_new_vector_from_pointer_position(
					basis,
					position,
				)
		},
	}))

	use.mount(() => {
		stick.vector.set(Vec2.zero())
		return () => stick.vector.set(Vec2.zero())
	})

	return html`
		<div
			class=container
			.vector="${stick.vector}"
			@pointerdown="${listeners.pointerdown}"
			@pointermove="${listeners.pointermove}"
			@pointerup="${listeners.pointerup}">
			${NubStickGraphic.props(stick.vector.get(), updateBasis)
				.attr("part", "graphic")
				.render()}
		</div>
	`
})

