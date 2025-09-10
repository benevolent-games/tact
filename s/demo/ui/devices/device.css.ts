
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

.box {
	padding: 0.2em;
	min-height: 5rem;
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


`


