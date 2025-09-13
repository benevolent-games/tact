
// TODO replace these types when they're available in stz

export type First<A extends any[]> = (
	A extends [infer X, ...any[]]
		? X
		: never
)

export type DropFirst<A extends any[]> = (
	A extends [any, ...infer X]
		? X
		: never
)

export type DropFirstParam<Fn extends (...params: any[]) => any> = (
	(...params: DropFirst<Parameters<Fn>>) => ReturnType<Fn>
)

