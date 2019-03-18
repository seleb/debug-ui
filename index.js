import './style.css';

const debugEl = document.createElement('aside');
debugEl.className = 'debug-ui';
const listEl = document.createElement('ul');
debugEl.appendChild(listEl);
const debug = {};
document.body.appendChild(debugEl);

export function init() {
	function update() {
		Object.values(debug).forEach(({ input, getter }) => {
			input.value = getter();
		});
	}
	function updateLoop() {
		update();
		requestAnimationFrame(updateLoop);
	}

	updateLoop();
}

export function debugValue(name, getter, setter) {
	const el = document.createElement('li');
	const label = document.createElement('label');
	const input = document.createElement('input');
	el.appendChild(label);
	label.textContent = name;
	label.appendChild(input);

	const entry = debug[name] = {
		getter,
		setter,
		input,
	};
	listEl.appendChild(el);
}
