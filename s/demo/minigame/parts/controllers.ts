
import {GroupController} from "../../../core/controllers/infra/group.js"
import {StickController} from "../../../core/controllers/standard/stick.js"
import {PointerController} from "../../../core/controllers/standard/pointer.js"
import {KeyboardController} from "../../../core/controllers/standard/keyboard.js"

export type GameController = GameKeyboard | GameStick

export class GameKeyboard extends GroupController {
	constructor() {
		super(
			new KeyboardController(),
			new PointerController(),
		)
	}
}

export class GameStick extends StickController {}

