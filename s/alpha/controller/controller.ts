
import {Bindings} from "../bindings/bindings.js"
import {BindingsData} from "../bindings/types.js"

export class Controller<B extends BindingsData> {
	constructor(bindings: Bindings<B>) {}
}

