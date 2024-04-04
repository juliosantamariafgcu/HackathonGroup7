module.exports = {
  // Other webpack configurations...

  module: {
    rules: [
      // Other rules...
      {
        test: /\.html$/,
        exclude: /index\.html$/,  // Exclude index.html from being processed
        use: {
          loader: 'html-loader',
        },
      },
    ],
  },
};

