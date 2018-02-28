import metablock from 'rollup-plugin-userscript-metablock'
import babel from 'rollup-plugin-babel'

export default {
	input: 'src/index.js',
	output: {
		file: 'userscript.js',
		format: 'iife',
		globals: {
			jquery: '$'
		}
	},
	external: ['jquery'],
	plugins: [metablock({ file: 'src/meta.json' }), babel()]
}
