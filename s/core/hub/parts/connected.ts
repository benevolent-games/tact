
import {Device} from "../../devices/device.js"
import {MetaBindings, metaMode} from "../types.js"
import {Resolver} from "../../bindings/resolver.js"
import {makeMetaBindings} from "../meta-bindings.js"

export class Connected {
	metaResolver: Resolver<MetaBindings>

	constructor(public device: Device, metaB = makeMetaBindings()) {
		this.metaResolver = new Resolver(metaB)
		this.metaResolver.modes.add(metaMode)
	}
}

