
import {sub} from "@e280/stz"
import {Device, Sample} from "./types.js"
import {SampleMap} from "../parts/sample-map.js"

export class SamplerDevice implements Device {
	on = sub<Sample>()
	sampleMap = new SampleMap()

	setSample(code: string, value: number) {
		this.sampleMap.set(code, value)
		this.on.pub(code, value)
		return this
	}

	*samples() {
		for (const sample of this.sampleMap)
			yield sample as Sample
	}
}

