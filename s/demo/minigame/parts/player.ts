
import {Agent} from "./agent.js"
import {Controller} from "../../../core/controllers/controller.js"

export class Player {
	constructor(
		public controller: Controller,
		public agent: Agent,
		public dispose: () => void,
	) {}
}

