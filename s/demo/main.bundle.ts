
import {dom} from "@e280/sly"
import {Game} from "./game/game.js"
import {DemoTheater} from "./ui/theater/view.js"
import {deckComponents} from "../deck/components/components.js"

const game = await Game.load()

dom.register({
	...deckComponents(game.deck),
	DemoTheater: class extends DemoTheater { game = game },
})

console.log("🎮 tact")

