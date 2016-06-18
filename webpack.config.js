module.exports = {
  entry: './public/src/main.js',
  output: {
    path: 'public/bin/',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'jsx-loader',
    }]
  }
}

