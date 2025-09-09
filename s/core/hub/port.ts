
import {SetG} from "@e280/stz"
import {Bindings} from "../bindings/types.js"
import {Resolver} from "../bindings/resolver.js"
import {Controller} from "../controllers/controller.js"

export class Port<B extends Bindings> extends Resolver<B> {
	readonly controllers = new SetG<Controller>()
}

