
export class SetG<T> extends Set<T> {
	adds(...items: T[]) {
		for (const item of items) super.add(item)
		return this
	}

	deletes(...items: T[]) {
		for (const item of items) super.delete(item)
		return this
	}
}

