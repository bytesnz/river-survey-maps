 module.exports = {
  entry: './build/index.js',
  output: {
    path: './',
    filename: 'rivermaps.js',
    devtoolLineToLine: {
      test: /\.js$/,
      exclude: /node_modules/
    },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
}
