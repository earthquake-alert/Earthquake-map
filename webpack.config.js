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
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}
