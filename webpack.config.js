const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        // We won't actually use the emitted JS file because it'll be inlined.
        filename: 'bundle.js',
        // path: path.resolve(__dirname, 'docs'),
        clean: false, // clears docs/ each build
    },
    module: {
        rules: [
            // Import popup HTML snippets as strings
            { test: /\.html$/i, include: /src\/popups/, type: 'asset/source' },

            // Inline CSS into the JS (which will be inlined into index.html)
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },

            // Inline small images/fonts as data URIs (Leaflet marker icons, etc.)
            { test: /\.(png|jpg|gif|svg|woff2?)$/i, type: 'asset/inline' },
        ],
    },
    optimization: {
        splitChunks: false,
        runtimeChunk: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',    // basic HTML shell
            filename: 'index.html',
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        // Inlines the generated <script> into index.html so no bundle.js file is referenced
        new HtmlInlineScriptPlugin(),
    ],
    devtool: false,
};
