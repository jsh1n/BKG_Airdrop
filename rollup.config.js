import svelte from 'rollup-plugin-svelte';
import replace from '@rollup/plugin-replace';
import json from "@rollup/plugin-json";

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import dotenv from 'dotenv';

const production = !process.env.ROLLUP_WATCH;
const envpath = production ? '.env.production' : '.env'
dotenv.config({ path: envpath });

function serve() {
	let server;
	function toExit() {
		if (server) server.kill(0);
	}
	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
            CONTRACT_ADDRESS: JSON.stringify(process.env.CONTRACT_ADDRESS)
        }),
		json({
  			compact: true,
		}),
		svelte({
			compilerOptions: {
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
