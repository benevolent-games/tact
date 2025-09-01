
import {obMap, xub} from "@e280/stz"
import {Action} from "../../action.js"
import {Actions} from "../../types.js"
import {Bindings} from "../../../bindings/types.js"

export function build_updatable_actions_structure<B extends Bindings>(
		bindings: B,
		resolveActionValue: (mode: keyof B, actionKey: keyof B[keyof B]) => number,
	) {

	const updateValues = xub()

	const actions = obMap(bindings, (bracket, mode) =>
		obMap(bracket, (_, actionKey) => {
			const action = new Action()
			updateValues.on(() => {
				const value = resolveActionValue(mode, actionKey)
				Action.updateValue(action, value)
			})
			return action
		})
	) as Actions<B>

	return {
		actions,
		updateValues: updateValues.publish,
	}
}

