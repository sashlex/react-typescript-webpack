'use strict';

const path = require( 'path' );
const webpack = require( 'webpack' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const NODE_ENV = process.env.NODE_ENV || 'development';
const production = NODE_ENV === 'production';

module.exports = {
   mode: 'development',
   entry: {
      app: './app',
   },
   output: {
      path: path.resolve( __dirname, 'dist' ),
      publicPath: '/',
      filename: '[name].[contenthash:8].js',
      pathinfo: !  production
   },
   devServer: {
      contentBase: path.join( __dirname, 'dist' ),
      port: 3000,
      watchContentBase: true,
      historyApiFallback: { // html5 history
         disableDotRule: true
      }
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: [
               { loader: 'cache-loader' },
               { loader: 'thread-loader' },
               {
                  loader: 'ts-loader',
                  options: {
                     configFile: 'tsconfig.json',
                     transpileOnly: ! production,
                     experimentalWatchApi: ! production,
                     happyPackMode: true, // typecheck in fork-ts-checker-webpack-plugin for build perf
                  }
               }
            ],
            exclude: /node_modules/,
         },
         { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
         {
            test: /\.html$/,
            use: [{ loader: 'html-loader', options: { exportAsEs6Default: 'es6' }}],
            exclude: /node_modules/,
         },
         {
            test: /\.(less|css)$/,
            use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader' ],
            exclude: /node_modules/,
         }
      ]
   },
   resolve: {
      extensions: [ '.tsx', '.ts', '.js', '.json' ]
   },
   optimization: production ? {
      nodeEnv: 'production',
      runtimeChunk: 'single',
      splitChunks: {
         chunks: 'all',
         maxInitialRequests: Infinity,
         minSize: 0,
         cacheGroups: {
            vendor: {
               test: /[\\/]node_modules[\\/]/,
               name( module ) { // https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
                  const packageName = module.context.match( /[\\/]node_modules[\\/](.*?)([\\/]|$)/ )[ 1 ]; // get the name. E.g. node_modules/packageName/not/this/part.js or node_modules/packageName
                  return `vendor.${ packageName.replace( '@', '' ) }`; // npm package names are URL-safe, but some servers don't like @ symbols
               },
            },
         },
      }
   } : { // no optimizations for development
      nodeEnv: 'development',
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
   },
   plugins: [
      ! production ? new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true, tsconfig: './tsconfig.json' }) : _=>_,
      new webpack.ProgressPlugin({ profile: false }),
      new CleanWebpackPlugin([ 'dist' ], { root: __dirname, exclude: [ '.gitkeep' ], verbose: true }),
      new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedl
      new HtmlWebpackPlugin({
         hash: true,
         template: 'app/index.html'
      }),
      new MiniCssExtractPlugin({
         filename: '[name].css',
      }),
      new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ), // ignore unwanted moment locales ( https://github.com/moment/moment/issues/2517#issuecomment-393704231 )
   ],
};
