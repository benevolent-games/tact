
import {obMap} from "@e280/stz"
import {Bindings, BindingsShape, BindingsTable} from "../types.js"

export function makeShape<B extends Bindings>(data: B, table: BindingsTable<B>) {
	const shape = obMap(data, bracket => obMap(bracket, () => 0)) as any

	for (const [id, {mode, action}] of table)
		shape[mode][action] = id

	return shape as BindingsShape<B>
}

