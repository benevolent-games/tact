
import {Hub} from "../../../core/hub/hub.js"
import {Port} from "../../../core/hub/port.js"
import {Deck} from "../../../core/deck/deck.js"
import {asBindings} from "../../../core/bindings/types.js"

export type GameBindings = typeof gameBindings
export type GamePort = Port<GameBindings>
export type GameDeck = Deck<GameBindings>
export type GameHub = Hub<GameBindings>

export const gameBindings = asBindings({
	gameplay: {
		up: ["or", "KeyW", "ArrowUp", "stick.up"],
		down: ["or", "KeyS", "ArrowDown", "stick.down"],
		left: ["or", "KeyA", "ArrowLeft", "stick.left"],
		right: ["or", "KeyD", "ArrowRight", "stick.right"],
	},
})

