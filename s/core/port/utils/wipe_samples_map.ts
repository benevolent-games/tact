
import {SampleMap} from "../../controllers/types.js"

export function wipe_samples_map(samples: SampleMap) {
	for (const code of samples.keys())
		samples.set(code, 0)
}

