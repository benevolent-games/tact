
import {Vec2} from "@benev/math"

export function find_closest_point_on_circle(
		radius: number,
		{x, y}: Vec2,
	): Vec2 {

	const magnitude = Math.sqrt((x ** 2) + (y ** 2))

	return Vec2.new(
		(x / magnitude) * radius,
		(y / magnitude) * radius,
	)
}
