import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import {
	terser
} from "rollup-plugin-terser";
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json';

export default {
	input: './index',
	output: [{
		file: pkg.main,
		format: 'cjs',
	}, {
		file: pkg.module,
		format: 'es',
	}, {
		file: `./dist/${pkg.name}.min.js`,
		name: pkg.name.replace(/-(.)/g, (_, str) => str.toUpperCase()),
		format: 'iife',
	}],
	plugins: [
		babel(),
		commonjs(),
		terser(),
		terser({
		}),
		postcss(),
	],
}
