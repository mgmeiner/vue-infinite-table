var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrors = require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: {
    'vue-infinite-table-demo': [path.resolve(__dirname, './devClient.js'), path.resolve(__dirname, '../demo/main.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist/demo'),
    publicPath: '/',
    filename: 'js/[name].[hash].js'
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrors(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../demo/index.html'),
      inject: true
    })
  ]
})
