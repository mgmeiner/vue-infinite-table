var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.conf')

var env = process.env.NODE_ENV;

module.exports = merge(baseWebpackConfig, {
  entry: {
    'vue-infinite-table-demo': path.resolve(__dirname, '../demo/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/demo'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"' + env + '"'
      }
    }),
    new ExtractTextPlugin('css/[name].[contenthash].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../demo/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    new webpack.LoaderOptionsPlugin({
      vue: {
        loaders: {
          less: ExtractTextPlugin.extract({fallbackLoader: 'vue-style-loader', loader: 'css-loader!less-loader'}),
          postcss: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]
        }
      }
    })
  ]
})
