
import {view} from "@e280/sly"
import {styles} from "./styles.css.js"
import {Game} from "../../game/game.js"
import {loader} from "../utils/loader.js"
import {Theater} from "../theater/view.js"

export class TactDemo extends view.component(use => {
	use.css(styles)
	const opGame = use.op.load(async() => Game.load())
	return loader(opGame, game => Theater(game))
}) {}

