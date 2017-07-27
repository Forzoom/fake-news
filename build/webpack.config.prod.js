const path = require('path');
const webpack = require('webpack')

process.env.NODE_ENV = 'production'; // 对于vue-loader代码有效

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'fake-news.min.js',
		library: 'fake-news',
		libraryTarget: 'umd',
	},
	externals: {
		vue: 'vue',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				include: [path.resolve(__dirname, '../src')]
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				include: [path.resolve(__dirname, '../src')]
			}, {
				test: /\.css$/,
				loader: [
					'style-loader',
					'css-loader',
				],
				include: [path.resolve(__dirname, '../src')]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'), // 对于src代码有效
	    }),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
	],
	watch: true,
}	