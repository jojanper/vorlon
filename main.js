const fs = require('fs');
const { Worker } = require('worker_threads');
const argv = require('minimist')(process.argv.slice(2));

require('babel-register')({
    presets: ['es2015']
});

const { DataReader } = require('./src/worker/data');

const { input, output } = argv;

function startDecoding(worker, stream) {
    // No more data available for decoding -> signal end-of-stream to worker
    stream.on('end', () => worker.postMessage({ name: 'eos' }));

    // New audio data available for decoding -> signal data to worker
    stream.on('data', chunk => worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } }));
}

if (!input) {
    throw new Error('No input file specified (use --input=<mp3-file>)');
}

if (!output) {
    throw new Error('No output file specified (use --output=<decoded-file>)');
}

const stream = fs.createReadStream(input);
const outStream = fs.createWriteStream(output);

// Start Web Worker and pass the library name as input
const worker = new Worker('./src/node_worker.js');

worker.on('error', (err) => { throw err; });

// Handle messages from worker
worker.on('message', (message) => {
    if (!message) {
        return;
    }

    if (message.ready) {
        worker.postMessage({
            name: 'config',
            data: {
                mime: 'audio/wav'
            }
        });

        // Decoder is ready to receive data
        console.log('Start decoding');
        startDecoding(worker, stream);
    } else if (message.eos) {
        // Worker signalled that end-of-stream has been encountered
        worker.postMessage({ type: 'close' });
        outStream.end();
        worker.unref();
    } else if (message.channelData) {
        // Output buffer as 16-bit integer
        const arrData = new ArrayBuffer(message.length * message.numChannels * 2);
        const channelData = new Int16Array(arrData);

        // Channel data readers
        const channelReaders = message.channelData.map(item => new DataReader(new DataView(item)));

        // Convert floating point samples to 16-bit integer
        for (let i = 0, index = 0; i < message.length; i++) {
            for (let ch = 0; ch < message.numChannels; ch++) {
                channelData[index] = Math.round(32768 * channelReaders[ch].pcm32f());
                index++;
            }
        }

        outStream.write(Buffer.from(arrData));
    }
});
