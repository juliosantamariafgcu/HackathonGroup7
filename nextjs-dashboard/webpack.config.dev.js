loaders: [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loaders: ['babel']
  }
  {
    test: /\.html$/,
    exclude: /node_modules/,
    loader: 'html-loader'
  },
]
