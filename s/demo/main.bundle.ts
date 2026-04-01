
import {dom} from "@e280/sly"
import {Game} from "./game/game.js"
import {DemoTheater} from "./ui/theater/view.js"

const game = await Game.load()

dom.render(dom("#demo-theater"), DemoTheater(game))

console.log("🎮 tact")
