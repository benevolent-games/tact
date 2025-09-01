
import {SetG} from "@e280/stz"
import {Controller} from "./controller.js"

export class GroupController extends Controller {
	controllers = new SetG<Controller>()

	constructor(...controllers: Controller[]) {
		super()
		this.controllers.adds(...controllers)
	}

	takeSamples() {
		return [...this.controllers].flatMap(controller => controller.takeSamples())
	}
}

