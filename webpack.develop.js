var webpack = require('webpack');
console.log(__dirname + '/src/a');
module.exports = {
    cache: false,
    entry: {
        demo: './demo/index' // 自定义位置
    },
    output: {
        // 这个path配置和pipe.dest()冲突
        // 所以如果使用"gulp watch" 此行要注释掉
        // 如果使用"webpack --watch" 此行要打开
        // path: './dist', 
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
        // libraryTarget: "commonjs"
    },
    devtool: '#source-map', // 这个配置要和output.sourceMapFilename一起使用
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    resolve: {
        alias: {
            'tingle-icon': __dirname + '/Icon'
        }
    },
    externals: {
        react: 'var React' // 相当于把全局的React作为模块的返回 module.exports = React;
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin("common.js", ["b", "c"])
    ]
};