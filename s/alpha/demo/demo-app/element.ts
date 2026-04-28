
import {html} from "lit"
import {RSet} from "@e280/strata"
import {shadowElement, useCss, useMount, useOnce} from "@e280/sly"

import styleCss from "./style.css.js"
import {onPad, Pad} from "../../parts/device/parts/pad.js"

export class DemoApp extends shadowElement(() => {
	useCss(styleCss)

	const pads = useOnce(() => new RSet<Pad>)

	useMount(() => onPad(pad => {
		pads.add(pad)
		return () => pads.delete(pad)
	}))

	return html`
		<div class=plate>
			pads
			<ul>
				${pads.array().map(({gamepad}) => html`
					<li>
						<span>${gamepad.id}</span>
						<span>${gamepad.index}</span>
						<span>${gamepad.mapping}</span>
						<span>${gamepad.connected ? "connected" : "disconnected"}</span>
					</li>
				`)}
			</ul>
		</div>
	`
}) {}

