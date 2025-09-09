
import {Deck} from "../../../core/deck/deck.js"
import {hubBindings} from "../../../core/hub/bindings.js"
import {asBindings} from "../../../core/bindings/types.js"
import {localStorageKv} from "../../../core/deck/parts/local-storage-kv.js"

export type GameDeck = Awaited<ReturnType<typeof loadDeck>>
export type GameBindings = typeof gameBindings

export const gameBindings = asBindings({
	...hubBindings(),
	gameplay: {
		up: "KeyW",
		down: "KeyS",
		left: "KeyA",
		right: "KeyD",
		sprint: "ShiftLeft",
	},
})

export async function loadDeck() {
	return Deck.load({
		portCount: 4,
		kv: localStorageKv(),
		bindings: gameBindings,
	})
}

