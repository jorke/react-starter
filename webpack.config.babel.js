import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack, { DefinePlugin } from 'webpack'
import paths from "./scripts/paths"
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import getClientEnvironment from './scripts/env'

const appEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

export default (env, args) => {
  const isDevelopment = args.mode !== 'production';
  
  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'cheap-module-source-map',

    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
    },
    entry: [
      ...(isDevelopment) ? ['webpack-hot-middleware/client']: [],
      paths.appIndexJs,
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, 'dist'),
      publicPath: paths.publicUrlOrPath,
    },
    module: {
      rules: [ 
        {
          test: /\.json$/i,
          type: 'javascript/auto',
          loader: 'file-loader',
        },
        
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.s?css$/,
          use: [
              'style-loader', 
              // MiniCssExtractPlugin.loader,
              'css-loader',
              // 'postcss-loader'
            ],
        },
      ],
    },
    devServer: {
      open: true,
      hot: true,
    },
    plugins: [
        
      // new MiniCssExtractPlugin(),
      new InterpolateHtmlPlugin(HTMLWebpackPlugin, appEnv.raw),
      // new WebpackManifestPlugin({
      //   fileName: 'manifest.json',
      //   publicPath: paths.publicUrlOrPath,
      //   generate: (seed, files, entrypoints) => {
      //     const manifestFiles = files.reduce((manifest, file) => {
      //       manifest[file.name] = file.path;
      //       return manifest;
      //     }, seed);
      //     const entrypointFiles = entrypoints.main.filter(
      //       fileName => !fileName.endsWith('.map')
      //     );

      //     return {
      //       files: manifestFiles,
      //       entrypoints: entrypointFiles,
      //     };
      //   },
      // }),
      new DefinePlugin(appEnv.stringified),
      new HTMLWebpackPlugin({
        template: paths.appHtml,
        inject: true        
      }),
      ...(isDevelopment) ? [new webpack.HotModuleReplacementPlugin()] : []
        // production
    ],
    optimization: (isDevelopment) ? {} :   
      {
        splitChunks: {
          chunks: 'all',
        },
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        runtimeChunk: {
          name: 'runtime',
        },
      }}
}