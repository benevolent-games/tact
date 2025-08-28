
import {Vec2} from "@benev/math"

export function within_radius(radius: number, {x, y}: Vec2) {
	return (x ** 2) + (y ** 2) < (radius ** 2)
}
