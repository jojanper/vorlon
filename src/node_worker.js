const { parentPort } = require('worker_threads');

require('babel-register')({
    presets: ['es2015']
});

const { eventHandler } = require('./worker/entry');

// Decoder is ready to receive data
parentPort.postMessage({ ready: true });

// Handle messages to/from worker
parentPort.onmessage = event => eventHandler(event, data => parentPort.postMessage(data));
