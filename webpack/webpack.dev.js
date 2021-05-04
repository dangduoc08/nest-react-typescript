const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const cwd = process.cwd()

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  cache: true,
  stats: 'errors-only',
  entry: {
    main: [
      'webpack-hot-middleware/client?reload=true',
      './frontend'
    ]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(cwd, 'frontend_build'),
    publicPath: '/public/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/i,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsx.json'
            }
          }
        ],
        include: path.resolve(cwd, 'frontend'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './frontend/index.html',
      cache: true
    })
  ]
}

module.exports = merge(commonConfig, devConfig)