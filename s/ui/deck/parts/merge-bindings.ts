
import {deep} from "@e280/stz"
import {Bindings} from "../../../core/bindings/types.js"

export function mergeBindings<B extends Bindings>(normative: B, sus?: B) {
	const bindings = deep.clone(normative)

	if (!sus)
		return bindings

	for (const [mode, bracket] of Object.entries(bindings)) {
		for (const actionKey of Object.keys(bracket)) {
			const susAction = sus[mode]?.[actionKey]
			if (susAction)
				bracket[actionKey] = susAction
		}
	}

	return bindings
}

