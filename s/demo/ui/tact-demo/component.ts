
import {view} from "@e280/sly"
import {styles} from "./styles.css.js"
import {loader} from "../utils/loader.js"
import {Theater} from "../theater/view.js"
import {loadDeck} from "../../minigame/parts/game-deck.js"

export class TactDemo extends view.component(use => {
	use.css(styles)
	const opInputs = use.op.load(async() => loadDeck())
	return loader(opInputs, inputs => Theater(inputs))
}) {}

