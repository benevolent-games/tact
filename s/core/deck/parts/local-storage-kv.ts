
import {Kv, StorageDriver} from "@e280/kv"

export function localStorageKv() {
	return new Kv(new StorageDriver(window.localStorage))
}

