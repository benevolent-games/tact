
import {Kv, StorageDriver} from "@e280/kv"

export function localStorageKv() {
	const driver = new StorageDriver(window.localStorage)
	return new Kv(driver).scope("tact")
}

