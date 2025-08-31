
import {MapG} from "@e280/stz"
import {tmax} from "./tmax.js"
import {Sample} from "../types.js"

export function normalizeSamples(samples: Sample[]) {
	const map = new MapG<string, number[]>()

	for (const [code, value] of samples) {
		const values = map.guarantee(code, () => [])
		values.push(value)
	}

	return [...map.entries()]
		.map(([code, values]) => <Sample>[code, tmax(values)])
}

