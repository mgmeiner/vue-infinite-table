var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var projectRoot = path.resolve(__dirname, '../')
var env = process.env.NODE_ENV

var vueLessLoader = null;
if (env === 'development') {
  vueLessLoader = 'vue-style-loader!css-loader!less-loader';
} else {
  vueLessLoader = ExtractTextPlugin.extract({ use: 'css-loader!less-loader', fallback: 'vue-style-loader' });
}

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    modules: [
      path.join(__dirname, '../node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            less: vueLessLoader
          },
          postcss: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]
        }
      },
      {
        test: /\.css$/,
        loader: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        loader: [ 'style-loader', 'less-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(projectRoot, 'lib'),
          path.join(projectRoot, 'demo')
        ],
        exclude: /node_modules/
      }
    ]
  }
}
