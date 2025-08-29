
import {MapG} from "@e280/stz"
import {Cause} from "./cause.js"

export class CauseRepo {
	#causes = new MapG<string, Cause>()

	get(code: string) {
		return this.#causes.get(code)
	}

	guarantee(code: string) {
		return this.#causes.guarantee(code, () => new Cause())
	}

	resetAllToZero() {
		for (const cause of this.#causes.values())
			cause.value = 0
	}
}

