const rollup = require('rollup')
const metablock = require('rollup-plugin-userscript-metablock')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const fs = require('fs')

const pkg = require('./package.json')

;(async () => {
	const deps = pkg.dependencies
	pkg.require = Object.entries(deps).map(([dep, ver]) => `https://unpkg.com/${dep}@${ver.slice(1)}`)
	delete pkg.dependencies
	delete pkg.devDependencies
	delete pkg.scripts
	const bundle = await rollup.rollup({
		input: 'src/index.js',
		external: Object.keys(deps),
		plugins: [metablock({ meta: pkg }), vue({ css: true }), babel()]
	})
	await bundle.write({
		file: 'userscript.js',
		format: 'iife',
		globals: {
			jquery: '$',
			vue: 'Vue',
			sweetalert2: 'Sweetalert2'
		}
	})
})()
