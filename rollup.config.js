import metablock from 'rollup-plugin-userscript-metablock'
import babel from 'rollup-plugin-babel'

export default {
	input: 'src/index.js',
	output: {
		file: 'userscript.js',
		format: 'cjs'
	},
	plugins: [metablock({ file: 'src/meta.json' }), babel({ exclude: 'node_modules/**' })]
}
