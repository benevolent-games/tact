
export type DropFirst<T extends any[]> = (
	T extends [any, ...infer Rest]
		? Rest
		: never
)

export type First<T extends any[]> = (
	T extends [infer First, ...any[]]
		? First
		: never
)

export type DropFirstParam<Fn extends (...params: any[]) => any> = (
	(...params: DropFirst<Parameters<Fn>>) => ReturnType<Fn>
)

