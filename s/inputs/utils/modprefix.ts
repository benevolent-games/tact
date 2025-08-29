
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

