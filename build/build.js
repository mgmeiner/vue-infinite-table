require('shelljs/global')

var webpack = require('webpack')
var mode = process.argv[2]

var webpackConfig = null

if (mode === 'lib') {
    env.NODE_ENV = 'production'
    webpackConfig = require('./webpack.lib.conf')
} else if (mode === 'demo') {
    env.NODE_ENV = 'production'
    webpackConfig = require('./webpack.demo.conf')
}

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
