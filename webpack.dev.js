var webpack = require('webpack');
module.exports = {
    cache: false,
    entry: {
        demo: './demo/index'
    },
    output: {
        path: './dist', 
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },
    devtool: '#source-map', // 这个配置要和output.sourceMapFilename一起使用
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?stage=1'}
        ]
    },
    resolve: {
        alias: {
            'tingle-foo': __dirname + '/tingle/tingle-foo/src' // 自定义别名
        }
    },
    externals: {
        react: 'var React' // 相当于把全局的React作为模块的返回 module.exports = React;
    },
    plugins: [
        new webpack.DefinePlugin({
          __LOCAL__: true, // 本地环境
          __DEV__:   true, // 日常环境
          __PRO__:   false // 生产环境
        })
    ]
};