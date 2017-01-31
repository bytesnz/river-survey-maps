let HtmlWebpackPlugin = require('html-webpack-plugin');
let package = require('./package.json');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: './',
    filename: 'rivermaps.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: [ '.ts', '.js', '.scss', '.sass', '.css' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: package.name,
      template: 'src/index.ejs'
    }),
    new ExtractTextPlugin('rivermaps.css')
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader', 'sass-loader']
        })/*,
        options: {
          plugins: function() {
            return [autoprefixer, precss];
          }
        }*/
      },
      {
        test: /\.png$/,
        use: { loader: 'url-loader', options: { limit: 100000 } },
      }
    ]
  },
}
