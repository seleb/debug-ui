import './style.css';

let debugEl;
let listEl;
let debug;

function init() {
	debugEl = document.createElement('aside');
	debugEl.className = 'debug-ui';
	listEl = document.createElement('ul');
	debugEl.appendChild(listEl);
	debug = {};
	document.body.appendChild(debugEl);
	function update() {
		Object.values(debug).forEach(({ update }) => {
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

export default function(name, getter, setter) {
	lazyInit();
	const el = document.createElement('li');
	const label = document.createElement('label');
	const text = document.createElement('span');
	text.textContent = name;
	label.appendChild(text);
	let update;
	const initial = getter();
	const type = typeof initial;
	if (type === 'object') {
		// TODO: object debugger
		// also null
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
	} else {
		throw new Error(`Cannot debug "${name}" due to unsupported type "${type}"`);
	}
	update(initial);
	label.appendChild(input);
	el.appendChild(label);

	const entry = debug[name] = {
		update: () => {
			const current = getter();
			if (prev === current) {
				return;
			}
			update(current);
			prev = current;
		},
	};
	listEl.appendChild(el);
}
