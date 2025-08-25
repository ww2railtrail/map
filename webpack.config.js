const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname),
        clean: false,
        publicPath: '',
    },
    externals: {
        leaflet: 'L',
        'leaflet.awesome-markers': { root: ['L', 'AwesomeMarkers'] },
        'leaflet.legend': { root: ['L', 'control', 'Legend'] },
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                type: 'javascript/esm',
                use: {
                    loader: 'babel-loader',
                    options: { presets: [['@babel/preset-env', { targets: 'defaults' }]] }
                }
            },

            // Import popup HTML snippets as strings
            { test: /\.html$/i, include: /src\/popups/, type: 'asset/source' },

            // Inline CSS into the JS (which will be inlined into index.html)
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },

            // Inline small images/fonts as data URIs (Leaflet marker icons, etc.)
            { test: /\.(png|jpg|gif|svg|woff2?)$/i, type: 'asset/inline' },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,       // <- do not create bundle.js.LICENSE.txt
                terserOptions: {
                    format: {
                        comments: /@license|@preserve|^!/
                    },
                },
            }),
        ],
        splitChunks: false,
        runtimeChunk: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        new HtmlInlineScriptPlugin(),
    ],
    devtool: false,
    devServer: {
        static: {
            directory: __dirname,
        },
        watchFiles: ['src/*', 'dist/*'],
        liveReload: false
    },
};
