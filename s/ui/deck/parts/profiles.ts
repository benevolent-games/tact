
import {RMap} from "@e280/strata"
import {Id, Profile} from "../types.js"

export class Profiles {
	stock

	constructor(stock: Record<Id, Profile>, public custom: RMap<Id, Profile>) {
		this.stock = new RMap<Id, Profile>().absorbObject(stock)
		if (this.stock.size === 0) throw new Error("must be at least one stock profile")
	}

	get all() {
		return [...this.stock, ...this.custom]
	}

	normalizeId(id?: Id) {
		return id && (this.stock.has(id) || this.custom.has(id))
			? id
			: this.defaultId
	}

	get defaultId() {
		return [...this.stock.keys()][0]
	}

	get(id?: Id) {
		const norm = this.normalizeId(id)
		return this.stock.get(norm) ?? this.custom.need(norm)
	}
}

