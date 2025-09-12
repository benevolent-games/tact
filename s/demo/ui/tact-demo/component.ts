
import {cssReset, view} from "@e280/sly"
import styleCss from "./style.css.js"
import {Game} from "../../game/game.js"
import {loader} from "../utils/loader.js"
import {Theater} from "../theater/view.js"

export class TactDemo extends view.component(use => {
	use.css(cssReset, styleCss)
	const opGame = use.op.load(async() => Game.load())
	return loader(opGame, game => Theater(game))
}) {}

