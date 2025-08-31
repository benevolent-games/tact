
export function preventDefaultTouchShenanigans() {
	const preventer = (e: TouchEvent) => e.preventDefault()
	const opts = {passive: false}

	window.addEventListener("touchmove", preventer, opts)

	return () => {
		window.removeEventListener("touchmove", preventer)
	}
}

