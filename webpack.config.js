const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const packageJson = require('./package.json');

const VERSION = JSON.stringify(packageJson.version).replace(/"/g, '');

function config(env) {
    const folder = argv.folder || 'build';
    const ext = (env === 'production') ? '.min' : '';
    const filename = `decoder-worker.${VERSION}${ext}.js`;

    return {
        entry: './src/worker/worker.js',
        mode: env || 'development',
        output: {
            path: path.resolve(__dirname, folder),
            filename
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            envName: 'test'
                        }
                    }
                }
            ]
        }
    };
}

module.exports = env => config(env);
