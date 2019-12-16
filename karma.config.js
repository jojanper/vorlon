const path = require('path');

const webpackConfig = require('./webpack.config');

const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';

module.exports = function karmaConfig(config) {
    const wpConfig = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'src/**/*.js', watched: false }
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/**/*.spec.js': ['webpack', 'sourcemap'],
            'src/**/!(*spec).js': ['webpack', 'sourcemap'],
        },

        webpack: webpackConfig(),

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true // please don't spam the console when running in karma!
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'mocha'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeLocal'],

        customLaunchers: {
            ChromeLocal: {
                base: 'ChromeHeadless',
                flags: ['--disable-translate', '--disable-extensions']
            },
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    };

    if (!isTestWatch) {
        wpConfig.reporters.push('coverage');

        wpConfig.coverageReporter = {
            dir: path.join(__dirname, 'coverage'),
            reporters: [
                { type: 'text' },
                { type: 'text-summary' },
                { type: 'lcovonly' }
            ]
        };
    }

    if (config.travis) {
        wpConfig.browsers = ['Chrome_travis_ci'];
    }

    config.set(wpConfig);
};
