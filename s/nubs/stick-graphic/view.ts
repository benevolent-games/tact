
import {html} from "lit"
import {view} from "@e280/sly"
import {Vec2} from "@benev/math"

import {styles} from "./styles.js"
import {Basis} from "./types.js"
import {transform} from "./utils/transform.js"
import {calculate_basis} from "./utils/calculate_basis.js"
import {stick_vector_to_pixels} from "./utils/stick_vector_to_pixels.js"

export const NubStickGraphic = view(use => (
		vector: Vec2,
		updateBasis: (basis: Basis) => void,
	) => {

	use.name("nub-stick-graphic")
	use.styles(styles)

	const basis = use.signal<Basis | null>(null)

	use.rendered.then(() => {
		const base = use.shadow.querySelector<HTMLElement>(`[part="base"]`)
		const over = use.shadow.querySelector<HTMLElement>(`[part="over"]`)
		if (base && over) {
			const newBasis = calculate_basis(base, over)
			basis.value = newBasis
			updateBasis(newBasis)
		}
	})

	const pixels = stick_vector_to_pixels(basis.value?.radius, vector)
	const over_style = transform(pixels)
	const under_style = transform(pixels.clone().half())

	return html`
		<div part=base>
			<div part=under style="${under_style}"></div>
			<div part=over style="${over_style}"></div>
		</div>
	`
})

