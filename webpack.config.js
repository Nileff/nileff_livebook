var path = require('path');
var webpack = require('webpack');
require("babel-polyfill");

module.exports =
{
    watch: true,

    entry: './app/main/app.js',

    output: {
        path: path.join(__dirname, "build"),
        filename: 'app.js'
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: false
            },
            comments: false
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale/, /ru|en\-gb/)
    ],

    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: path.join(__dirname, "app"),
            exclude: /quill.js$/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react'],
                plugins: ["transform-es2015-for-of", "transform-object-assign"],
                cacheDirectory: true
            }
        }
        ]/*,
         noParse: /node_modules\/quill\/dist/
         noParse: /\/node_modules\/jquery/*/
    }
};