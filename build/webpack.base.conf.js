var path = require('path')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
var useCssSourceMap = env === 'development' || false;

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    modules: [
      path.join(__dirname, '../node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            less: 'vue-style-loader!css-loader!less-loader' //TODO: enable css-extracting for demo ExtractTextPlugin.extract({fallbackLoader: 'vue-style-loader', loader: 'css-loader!less-loader'})
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
