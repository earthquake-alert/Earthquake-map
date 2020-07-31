const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/ts/index.ts',
    output: {
        path: path.join(__dirname, "./src/static/js"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      },
    resolve: {
        extensions: ['.ts', '.js']
    }
}
