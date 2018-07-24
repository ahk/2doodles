module.exports = {
    entry: './src/app.ts',
    output: {
      path: __dirname + '/public',
      filename: 'build/app.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /lib\/.*\.js$/,
          loader: 'script-loader',
          exclude: /node_modules/
        }
      ]
    },
    externals: {
        'paper': 'paper'
    }
  }