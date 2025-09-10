
/** @deprecated use `disposer` from `@e280/stz` when it becomes available */
export function disposer() {
	let fns: (() => void)[] = []

	function d() {
		for (const fn of fns) fn()
		fns = []
	}

	d.schedule = (fn: () => void) => {
		fns.push(fn)
	}

	return d
}

