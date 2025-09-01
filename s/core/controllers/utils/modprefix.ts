
export function modprefix(event: KeyboardEvent | PointerEvent | WheelEvent, code: string) {
	const modifiers: string[] = []

	if (event.ctrlKey) modifiers.push("ctrl")
	if (event.altKey) modifiers.push("alt")
	if (event.metaKey) modifiers.push("meta")
	if (event.shiftKey) modifiers.push("shift")

	const prefix = modifiers.length > 0
		? [...modifiers].join("-")
		: "x"

	return `${prefix}-${code}`
}

