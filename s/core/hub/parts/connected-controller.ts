
import {MetaBindings, metaMode} from "../types.js"
import {Resolver} from "../../bindings/resolver.js"
import {makeMetaBindings} from "../meta-bindings.js"
import {SampleMap} from "../../bindings/sample-map.js"
import {Controller} from "../../controllers/controller.js"

export class ConnectedController {
	samples = new SampleMap()
	metaResolver: Resolver<MetaBindings>

	constructor(public controller: Controller, metaB = makeMetaBindings()) {
		this.metaResolver = new Resolver(metaB)
		this.metaResolver.modes.add(metaMode)
	}

	refreshSamples() {
		this.samples.zero().ingest(this.controller.takeSamples())
	}
}

