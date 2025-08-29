
import {Scalar} from "@benev/math"

export function tmin(values: number[]) {
	return values.length > 0
		? Math.min(...values)
		: 0
}

export function tmax(values: number[]) {
	return values.length > 0
		? Math.max(...values)
		: 0
}

export function isPressed(value: number) {
	return value > 0
}

export function applyDeadzone(value: number, deadzone: number) {
	if (value < deadzone)
		return 0

	if (value > 1)
		return value

	return Scalar.remap(
		value,
		deadzone, 1,
		0, 1,
	)
}

