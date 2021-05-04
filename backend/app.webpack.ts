import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {
  NextHandleFunction
} from 'connect'
const webpackConfig = require('../webpack/webpack.dev.js')

const isDev: boolean = process.env.NODE_ENV === 'development'
let compiler: webpack.Compiler
let devMiddleware: NextHandleFunction & webpackDevMiddleware.WebpackDevMiddleware
let hotMiddleware: NextHandleFunction & webpackHotMiddleware.EventStream

if (isDev) {
  compiler = webpack(webpackConfig)
  devMiddleware
    = webpackDevMiddleware(compiler, {
      publicPath: '/public/',
      logLevel: 'warn',
      stats: 'errors-only',
      writeToDisk: true
    })
  hotMiddleware
    = webpackHotMiddleware(compiler)
}

export {
  compiler,
  devMiddleware,
  hotMiddleware
}
