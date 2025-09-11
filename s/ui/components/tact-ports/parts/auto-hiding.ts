
import {debounce} from "@e280/stz"
import {Signal} from "@e280/strata"
import {Hub} from "../../../../core/hub/hub.js"

export type Autohide = {
	stickyTime: number
}

export function autohiding(
		autohide: Autohide | undefined,
		hub: Hub<any>,
		$active: Signal<boolean>,
	) {

	if (!autohide) {
		$active.set(true)
		return () => () => {}
	}

	const created = Date.now()
	const deactivate = debounce(autohide.stickyTime, () => $active.set(false))

	return () => hub.on(() => {
		const since = Date.now() - created
		if (since > 100) {
			$active.set(true)
			deactivate()
		}
	})
}

