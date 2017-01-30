var path = require('path')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
var useCssSourceMap = env === 'development' || false;

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
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
