
import {css} from "lit"
import {cssReset} from "@e280/sly"
export const deviceCss = css`

${cssReset}

:host {
	display: flex;
	flex-direction: column;
}

header {
	background: #fff2;
	padding: 0.3em;

	h1 {
		font-size: 0.7em;
	}

	h2 {
		font-size: 0.6em;
		font-family: monospace;
	}
}

.row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.box {
	gap: 0.5em;
	padding: 0.2em;
	min-height: 3rem;
}

[view="nub-stick"] {
	width: 2em;
}

button {
	font-size: 0.8em;
	margin: 0.1em;
}

.icon {
	font-size: 2.5em;
}

.text {
	font-size: 0.8em;
	font-family: monospace;
	opacity: 0.5;
}

`


