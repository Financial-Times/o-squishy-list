/*global exports*/
let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}

function getStyles() {
	const styles = `
		<style>
			ul {
				margin: 0;
				padding: 0;
				white-space: nowrap;
				width: 1000px;
			}
			li {
				display: inline-block;
				margin: 0;
				padding: 0;
				width: 100px;
				list-style-type: none;
			}
			li[aria-hidden=true] {
				display: none;
			}
		</style>`;

	return styles;
}

function insertWithoutMore() {
	const html = `<ul>
			<li data-priority="2">P2</li>
			<li data-priority="1">P1</li>
			<li data-priority="3">P3</li>
			<li>NP</li>
			<li data-priority="-1">Ex</li>
			<li data-priority="1">P1</li>
			<li data-priority="3">P3</li>
			<li>NP</li>
			<li data-priority="2">P2</li>
		</ul>`;
	insert(getStyles() + html);
}

function insertWithMore() {
	const html = `
		<ul>
			<li data-priority="2">P2</li>
			<li data-priority="1">P1</li>
			<li data-priority="3">P3</li>
			<li>NP</li>
			<li data-priority="-1">Ex</li>
			<li data-priority="1">P1</li>
			<li data-priority="3">P3</li>
			<li>NP</li>
			<li data-priority="2">P2</li>
			<li data-more aria-hidden="true">P2</li>
		</ul>`;
	insert(getStyles() + html);
}

export {
	insertWithoutMore,
	insertWithMore,
	reset
};
