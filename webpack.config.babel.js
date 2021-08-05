import path from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import paths from "./paths"
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
// import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin'
import getClientEnvironment from './env'

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

export default () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

    return {
      mode: isDevelopment ? 'development' : 'production',
      devtool: 'cheap-module-source-map',
      resolve: {
        modules: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules'),
        ],
      },
      resolveLoader: {
        modules: [path.join(__dirname, 'node_modules')],
      },
      
      entry: {
        main: [
          isDevelopment && 'webpack-hot-middleware/client',
          paths.appIndexJs
        ],
      },
      output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
        publicPath: paths.publicUrlOrPath
      },
      module: {
        rules: [
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
        new InterpolateHtmlPlugin(HTMLWebpackPlugin, env.raw),
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
        new HTMLWebpackPlugin({
          template: paths.appHtml,
          inject: true        
        }),
        isDevelopment && new webpack.HotModuleReplacementPlugin(),
      ],
    }
  }