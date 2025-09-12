
import {css} from "lit"
export default css`

:host {
	--color: #aaa;
}

.box {
	display: flex;
	align-items: center;
	justify-content: center;

	gap: 0em;
	padding: 0.2em;

	border-radius: 2em;
	background: color-mix(in srgb, #fff4, var(--color));
}

[view="nub-stick"] {
	width: 2em;
}

.label {
	font-size: 1.2em;
	font-weight: bold;

	padding: 0 0.5em;
	text-align: center;

	color: white;
	text-shadow: 0.1em 0.1em 0.1em #0004;
}

button {
	font-size: 0.8em;
	padding: 0.2em;
}

`

