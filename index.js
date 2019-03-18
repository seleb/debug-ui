const debugEl = document.createElement('div');
debugEl.style.position = 'absolute';
debugEl.style.top = 0;
debugEl.style.left = 0;
debugEl.style.color = 'white';
debugEl.style.background = 'rgba(0,0,0,0.5)';
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
