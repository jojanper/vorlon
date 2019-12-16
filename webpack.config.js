const path = require('path');

const packageJson = require('./package.json');

const VERSION = JSON.stringify(packageJson.version).replace(/"/g, '');

const filename = `decoder-worker.${VERSION}.js`;

function config(env) {
    return {
        entry: './src/worker/worker.js',
        mode: env || 'development',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };
}

module.exports = env => config(env);
