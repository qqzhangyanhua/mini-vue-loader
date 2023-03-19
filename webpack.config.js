const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const {VueLoaderPlugin} = require('vue-loader');
const {VueLoaderPlugin} = require('./vue-loader/index');

const webpack = require('webpack');
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    devtool:false,
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:path.resolve(__dirname,'./vue-loader/index.js') //'vue-loader'
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template:'./src/index.html'

        })
    ]

};
