
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
		up: ["or", "KeyW", "stick.up"],
		down: ["or", "KeyS", "stick.down"],
		left: ["or", "KeyA", "stick.left"],
		right: ["or", "KeyD", "stick.right"],
	},
})

