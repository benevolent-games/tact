// // TODO
//
// import {Bindings} from "../types.js"
//
// export function makeLookupProxies<B extends Bindings>(
// 		bindings: B,
// 	) {
//
// 	const getModeProxy = (mode: string) => new Proxy(bindings[mode], {
// 		get: (_, action: string) => {},
// 	})
//
// 	return new Proxy(bindings, {
// 		get: (_, mode: string) => getModeProxy(mode),
// 	})
// }
//
