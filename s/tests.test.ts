
import {Science} from "@e280/science"

await Science.run({
	"the science is settled": Science.test(async() => {
		Science.expect(2 + 2).is(4)
	}),
})

