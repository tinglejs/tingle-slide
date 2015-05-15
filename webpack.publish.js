var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: {
        PhotoField: './src/index' // 自定义位置
    },
    output: {
        // 这个path配置和pipe.dest()冲突
        // 所以如果使用"gulp watch" 此行要注释掉
        // 如果使用"webpack --watch" 此行要打开
        // path: './dist',
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    // devtool: '#inline-source-map',
    devtool: '#source-map', // 这个配置要和output.sourceMapFilename一起使用
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    externals: {
        react: 'var React', // 相当于把全局的React作为模块的返回 module.exports = React;
        'tingle-icon': 'require("tingle-icon")' // 相当于 require('tingle-icon')
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin("common.js", ["b", "c"])
    ]
};