
import {pipe} from "@e280/stz"
import {Device} from "../devices/device.js"
import {normalizeSamples} from "./normalize-samples.js"

export function collectSamples(...devices: Device[]) {
	return pipe(devices)
		.to(d => d.flatMap(device => device.takeSamples()))
		.to(normalizeSamples)
		.to(samples => new Map(samples))
		.done()
}

