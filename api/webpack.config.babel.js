import path from 'path'
import webpack from 'webpack'

export default {
  entry: path.resolve(__dirname),
  output: {
    path: path.join(__dirname, '..', 'dist', 'api'),
    filename: 'index.js',
    library: {
        name: 'index',
        type: 'global'
    }
    // 'index',
    // libraryTarget: 'umd',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '..'),
        exclude: path.resolve(__dirname, '..', 'node_modules'),
        loader: 'babel-loader',
      },
      {
        test: /\.graphql$/,
        include: path.resolve(__dirname, '..'),
        exclude: path.resolve(__dirname, '..', 'node_modules'),
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      XMLHttpRequest: ['xmlhttprequest', 'XMLHttpRequest'],
    }),
  ],
}