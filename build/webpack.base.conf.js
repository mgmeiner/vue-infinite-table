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
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        use: [ 'style-loader', 'less-loader' ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.join(projectRoot, 'lib'),
          path.join(projectRoot, 'demo')
        ],
        exclude: /node_modules/
      }
    ]
  }
}
