/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')
const {
  HotModuleReplacementPlugin
} = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  stats: 'errors-only',
  target: 'node',
  cache: true,
  watch: true,
  entry: [
    'webpack/hot/poll?100',
    './src/app.main.ts'
  ],
  output: {
    path: path.resolve(__dirname, '../node_modules/_tmp'),
    filename: 'app.main.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100']
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new StartServerPlugin({
      name: 'app.main.js'
    })
  ]
}