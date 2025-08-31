
import {Device} from "../../devices/infra/device.js"

export function aggregate_samples_into_map(
		devices: Set<Device>,
		map: Map<string, number>,
	) {

	for (const device of devices) {
		for (const [code, value] of device.takeSamples()) {
			const previous = map.get(code) ?? 0
			if (value > previous)
				map.set(code, value)
		}
	}

	return map
}

