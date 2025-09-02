
import {SampleMap} from "../../controllers/types.js"
import {Controller} from "../../controllers/controller.js"

export function aggregate_samples_into_map(
		controllers: Set<Controller>,
		map: SampleMap,
	) {

	for (const controller of controllers) {
		for (const [code, value] of controller.takeSamples()) {
			const previous = map.get(code) ?? 0
			if (value > previous)
				map.set(code, value)
		}
	}

	return map
}

