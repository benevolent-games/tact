
import {Vec2} from "@benev/math"

export function stick_vector_to_pixels(
		radius: number | undefined,
		vector: Vec2,
	) {

	return radius !== undefined
		? vector.clone().multiply_(radius, -radius)
		: Vec2.zero()
}

