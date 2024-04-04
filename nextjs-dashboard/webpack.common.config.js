resolve: {
  extensions: ['', '.tsx', '.ts', '.js', '.html', '.cs']
},
module: {
  loaders: [
    { test: /\.tsx$/, loader: 'ts-loader' },
    { test: /\.html$/, loader: 'html-loader' },
    {
      test: /\.(gif|jpe?g|png|svg|tiff)(\?.*)?$/,
      loader: 'sharp-loader',
      query: {
        name: '[name].[hash:8].[ext]',
        cacheDirectory: true,
        presets: {
          // Preset 1
          thumbnail: {
            format: ['webp', 'jpeg'],
            width: 200,
            quality: 60,
          },
          // Preset 2
          prefetch: {
            // Format-specific options can be specified like this:
            format: {id: 'jpeg', quality: 30},
            mode: 'cover',
            blur: 100,
            inline: true,
            size: 50,
          },
        },
      },
    }
  ]
}
