
import {Deck} from "../../../core/deck/deck.js"
import {hubBindings} from "../../../core/hub/bindings.js"
import {localStorageKv} from "../../../core/deck/parts/local-storage-kv.js"

export type GameDeck = Awaited<ReturnType<typeof loadDeck>>

export async function loadDeck() {
	return Deck.load({
		portCount: 4,
		kv: localStorageKv(),
		bindings: {
			...hubBindings(),
			gameplay: {
				up: "KeyW",
				down: "KeyS",
				left: "KeyA",
				right: "KeyD",
			},
		},
	})
}

