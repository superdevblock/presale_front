const colors = require('./node_modules/tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				7: 'repeat(7, minmax(0, 1fr))',
				8: 'repeat(8, minmax(0, 1fr))',
			},
			colors: {
				rose: colors.rose,
				fuchsia: colors.fuchsia,
				indigo: colors.indigo,
				teal: colors.teal,
				lime: colors.lime,
				orange: colors.orange,
				slate: colors.slate,
				zinc: colors.zinc,
				neutral: colors.neutral,
				stone: colors.stone,
				amber: colors.amber,
				emerald: colors.emerald,
				cyan: colors.cyan,
				sky: colors.sky,
				violet: colors.violet,
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],
			},
		],

	},
	plugins: [],
};
