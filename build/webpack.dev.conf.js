var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrors = require('friendly-errors-webpack-plugin')

var env = process.env.NODE_ENV;

module.exports = merge(baseWebpackConfig, {
  entry: {
    'vue-balloons-demo': [path.resolve(__dirname, './devClient.js'), path.resolve(__dirname, '../demo/main.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist/demo'),
    publicPath: '/',
    filename: 'js/[name].[hash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + env + '"'
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new FriendlyErrors(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../demo/index.html'),
      inject: true
    }),
  ],
  vue: {
    loaders: {
      less: 'vue-style-loader!css-loader!less-loader'
    }
  }
})
