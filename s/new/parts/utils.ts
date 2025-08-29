
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

export function modprefix(event: KeyboardEvent | PointerEvent | WheelEvent, code: string) {
	const modifiers: string[] = []
	if (event.ctrlKey) modifiers.push("C")
	if (event.altKey) modifiers.push("A")
	if (event.metaKey) modifiers.push("M")
	if (event.shiftKey) modifiers.push("S")
	const prefix = modifiers.length > 0
		? [...modifiers].join("-")
		: "X"
	return `${prefix}-${code}`
}

export function splitAxis(n: number) {
	return (n >= 0)
		? [0, n]
		: [Math.abs(n), 0]
}

