
import {sub} from "@e280/stz"
import {Sample} from "../types.js"
import {Device} from "../device.js"
import {SampleMap} from "../../bindings/sample-map.js"

export class SamplerDevice extends Device {
	on = sub<Sample>()
	sampleMap = new SampleMap()

	setSample(code: string, value: number) {
		this.sampleMap.set(code, value)
		this.on.pub(code, value)
		return this
	}

	;*samples() {
		for (const sample of this.sampleMap)
			yield sample as Sample
	}
}

