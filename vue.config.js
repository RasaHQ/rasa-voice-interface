/* eslint-disable no-param-reassign */
const webpack = require('webpack');

module.exports = {
	assetsDir: 'assets/',
	filenameHashing: false,
	productionSourceMap: false,
	integrity: false,
	css: {
		extract: false,
		loaderOptions: {
			sass: {
				data: `
				@import "@/style/_variables.scss";
			  `
			}
		}
	},
	configureWebpack: {
		resolve: {
			extensions: ['.js'],
			alias: {
				jquery: 'jquery/dist/jquery.min.js'
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				Popper: ['popper.js', 'default'],
				Util: 'exports-loader?Util!bootstrap/js/dist/util'
			})
		],
		optimization: {
			splitChunks: false
		}
	},
	chainWebpack: config => {
		config.module
			.rule('images')
			.test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
			.use('url-loader')
			.loader('url-loader')
			.tap(options => {
				// modify the options...
				options.limit = 8192;
				return options;
			});

		config.module.rule('svg').uses.clear();
		config.module
			.rule('svg')
			.use('svg-url-loader')
			.loader('svg-url-loader')
			.options({
				encoding: 'base64',
				limit: 4096,
				fallback: {
					loader: 'file-loader',
					options: {
						name: 'img/[name].[hash:8].[ext]'
					}
				}
			});
	}
};
