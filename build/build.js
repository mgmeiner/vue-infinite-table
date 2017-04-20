require('shelljs/global')

var webpack = require('webpack')
var mode = process.argv[2]

var webpackConfig = null

env.NODE_ENV = 'production'

if (mode === 'lib') {
  webpackConfig = require('./webpack.lib.conf')
} else if (mode === 'demo') {
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
