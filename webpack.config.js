const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const packageJson = require('./package.json');

const VERSION = JSON.stringify(packageJson.version).replace(/"/g, '');

const TEST_CONFIG = {
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

const LEGACY_CONFIG = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'legacy'
                    }
                }
            }
        ]
    }
};

const MODERN_CONFIG = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        envName: 'modern'
                    }
                }
            }
        ]
    }
};

function getCommonConfig(mode, folder, filename) {
    return {
        entry: './src/worker/worker.js',
        mode,
        output: {
            path: path.resolve(__dirname, folder),
            filename
        }
    };
}

function config(env) {
    const isTest = (env === 'test');
    const mode = (isTest) ? 'development' : env || 'development';
    const folder = argv.folder || 'build';
    const ext = (env === 'production') ? '.min' : '';
    const filename = `decoder-worker.${VERSION}${ext}.js`;

    // Test configuration
    if (isTest) {
        return { ...getCommonConfig(mode, folder, filename), ...TEST_CONFIG };
    }

    // Modern browser configuration
    const modern = { ...getCommonConfig(mode, folder, filename), ...MODERN_CONFIG };
    modern.output.filename = modern.output.filename.replace('.js', '.mjs');

    // Legacy browser configuration
    const legacy = { ...getCommonConfig(mode, folder, filename), ...LEGACY_CONFIG };

    // Build both legacy and modern versions
    return [legacy, modern];
}

module.exports = env => config(env);
