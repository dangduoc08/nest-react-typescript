const path = require('path')
const { INPUT_PATH } = require('./webpack.constant')
const cwd = process.cwd()

module.exports = {
  resolve: {
    alias: {
      '@store': path.resolve(cwd, `${INPUT_PATH}/store`),
      '@utils': path.resolve(cwd, `${INPUT_PATH}/utils`),
      '@containers': path.resolve(cwd, `${INPUT_PATH}/containers`),
      '@components': path.resolve(cwd, `${INPUT_PATH}/components`),
      '@services': path.resolve(cwd, `${INPUT_PATH}/services`),
      '@commons': path.resolve(cwd, `${INPUT_PATH}/commons`),
      '@assets': path.resolve(cwd, `${INPUT_PATH}/assets`)
    },
    extensions: ['.js', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|jpg|gif|png|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images'
            }
          }
        ]
      }
    ]
  }
}