import './style.scss';

let debugEl;
let listEl;
let debug;

function init() {
	debugEl = document.createElement('aside');
	debugEl.className = 'debug-ui';
	
	const label = document.createElement('label');
	debugEl.appendChild(label);
	const text = document.createElement('span');
	text.textContent = 'debug-ui';
	label.appendChild(text);
	const panel = getPanel();
	label.classList.add('collapsible');
	label.classList.add('collapsed');
	label.onclick = event => {
		if (!panel.contains(event.target)) {
			label.classList.toggle('collapsed');
		}
	}
	label.appendChild(panel);
	listEl = panel;
	debug = [];
	document.body.appendChild(debugEl);
	function update() {
		debug.forEach(({ update }) => {
			update();
		});
	}
	function updateLoop() {
		update();
		requestAnimationFrame(updateLoop);
	}

	updateLoop();
}

let inited = false;
function lazyInit() {
	if (!inited) {
		init();
		inited = true;
	}
}

function stopPropagation(event) {
	event.stopPropagation();
}

function getPanel() {
	const panel = document.createElement('ul');
	return panel;
}

export default function add(name, getter, setter) {
	lazyInit();
	const el = document.createElement('li');
	const label = document.createElement('label');
	el.appendChild(label);
	const text = document.createElement('span');
	text.textContent = name;
	label.appendChild(text);
	let update;
	const initial = getter();
	const type = typeof initial;
	if (type === 'object' && initial !== null) {
		const pList = listEl;
		const panel = getPanel();
		label.classList.add('collapsible');
		label.classList.add('collapsed');
		label.onclick = () => {
			label.classList.toggle('collapsed');
			label.onclick = event => {
				if (!panel.contains(event.target)) {
					label.classList.toggle('collapsed');
				}
			}
			listEl = panel;
			label.appendChild(panel);
			for (let k in initial) {
				if (initial.hasOwnProperty && initial.hasOwnProperty(k)) {
					add(k, () => initial[k], v => initial[k] = v);
				}
			}
			listEl = pList;
		}
		listEl.appendChild(el);
		return;
	}
	let prev;
	const input = document.createElement('input');
	if (type === 'number') {
		input.type = 'number';
		input.onchange = ({ currentTarget: { value } }) => setter(parseFloat(value));
		input.onkeydown = input.onkeyup = stopPropagation;
		update = current => input.value = current;
		if (!setter) {
			input.readOnly = input.disabled = true;
		}
	} else if(type === 'boolean') {
		input.type = 'checkbox';
		input.onchange = ({ currentTarget: { checked } }) => setter(checked);
		update = current => input.checked = current;
		if (!setter) {
			input.readOnly = input.disabled = true;
		}
	} else if (type === 'function') {
		text.remove();
		input.type = 'button';
		input.value = name;
		input.onclick = () => getter()();
		update = current => {};
	} else if (type === 'string') {
		input.type = 'text';
		input.onchange = ({ currentTarget: { value } }) => setter(value);
		input.onkeydown = input.onkeyup = stopPropagation;
		update = current => input.value = current;
		if (!setter) {
			input.readOnly = input.disabled = true;
		}
	} else if (type === 'object' || type === 'undefined' || type === 'symbol') {
		// null
		input.type = 'text';
		input.onchange = ({ currentTarget: { value } }) => setter(value);
		input.onkeydown = input.onkeyup = stopPropagation;
		update = current => {};
		input.readOnly = input.disabled = true;
	} else {
		throw new Error(`Cannot debug "${name}" due to unsupported type "${type}"`);
	}
	update(initial);
	label.appendChild(input);

	debug.push({
		name,
		update: () => {
			const current = getter();
			if (prev === current) {
				return;
			}
			update(current);
			prev = current;
		},
	});
	listEl.appendChild(el);
}
