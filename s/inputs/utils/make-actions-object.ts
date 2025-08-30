
import {ob} from "@e280/stz"
import {Lens} from "../parts/lens.js"
import {Fork} from "../units/fork.js"
import {Cause} from "../units/cause.js"
import {Spoon} from "../units/spoon.js"
import {Action} from "../parts/action.js"
import {Actions, Bindings, BracketBinds, LensBind, SpoonBind} from "../types.js"

export type ObtainCauseFn = (code: string) => Cause

export function makeInputsActions<B extends Bindings>(
		bindings: B,
		obtainCause: ObtainCauseFn,
	) {

	function makeBracket<B2 extends BracketBinds>(binds: B2) {
		const bracket = {} as {[K in keyof B2]: Action}
		for (const [name, spoonBinds] of Object.entries(binds)) {
			const spoons = spoonBinds.map(bind => makeSpoon(bind))
			const fork = new Fork(spoons)
			bracket[name as keyof B2] = new Action(fork)
		}
		return bracket
	}

	function makeSpoon(bind: SpoonBind) {
		const lenses = bind.lenses.map(makeLens)
		const required = (bind.required ?? []).map(makeLens)
		const forbidden = (bind.forbidden ?? []).map(makeLens)
		return new Spoon(lenses, required, forbidden)
	}

	function makeLens({code, settings}: LensBind) {
		const cause = obtainCause(code)
		return new Lens(cause, settings)
	}

	const actions = (
		ob(bindings).map(binds => makeBracket(binds))
	) as Actions<B>

	return actions
}

