
import {SetG} from "@e280/stz"
import {Device} from "../devices/device.js"
import {Bindings} from "../bindings/types.js"
import {Resolver} from "../bindings/resolver.js"

export class Port<B extends Bindings> extends Resolver<B> {
	readonly devices = new SetG<Device>()
}

