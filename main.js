const fs = require('fs');
const { Worker } = require('worker_threads');
const argv = require('minimist')(process.argv.slice(2));

require('babel-register')({
    presets: ['es2015']
});

const { DataReader } = require('./src/worker/data');

const { input, output } = argv;

function startDecoding(worker, stream, chunkSize) {
    stream.on('end', () => {
        console.log('End of stream found');
        worker.postMessage({ name: 'eos' });
    });

    /*
    stream.on('data', (chunk) => {
        console.log(chunk.length);
        worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } });
    });
    */

    stream.on('readable', () => {
        let data;

        while (data = stream.read()) {
            console.log(data.length);
            worker.postMessage({ name: 'decode', data: { decode: data.buffer } });
        }
    });

    /*
    let counter = 0;
    stream.on('readable', () => {
        let chunk;

        counter++;
        console.log('READABLE', counter);

        // Read fixed size data and pass for decoding
        *
        while ((chunk = stream.read(chunkSize))) {
            console.log(chunk.length);
            worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } });
        }
        *

        do {
            chunk = stream.read(chunkSize);
            //console.log(chunk);
            //worker.postMessage({ type: 'data', data: chunk });
            if (chunk) {
                worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } });
            }
        } while (chunk);

        counter--;
        console.log('done');

        // Read remaining data and pass for decoding + signal EOS
        /*
        while ((chunk = stream.read())) {
            console.log('1', chunk.length);
            worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } });
        }
        *

        //console.log('End of stream found');
        //worker.postMessage({ name: 'eos' });

        do {
            chunk = stream.read();
            //worker.postMessage({ type: 'data', data: chunk });
            if (chunk) {
                worker.postMessage({ name: 'decode', data: { decode: chunk.buffer } });
            }
            //if (chunk) {
            //    worker.postMessage({ type: 'eos' });
            //}
        } while (chunk);
    });
    */
}

if (!input) {
    throw new Error('No input file specified (use --input=<mp3-file>)');
}

if (!output) {
    throw new Error('No output file specified (use --output=<decoded-file>)');
}

const stream = fs.createReadStream(input);
const outStream = fs.createWriteStream(output);
const chunkSize = 64 * 1024;

// Start Web Worker and pass the library name as input
const worker = new Worker('./src/node_worker.js');

worker.on('error', err => { throw err; });

// Handle messages from worker
worker.on('message', message => {
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
        startDecoding(worker, stream, chunkSize);
    } else if (message.eos) {
        // Worker signalled that end-of-stream has been encountered
        console.log('Decoding finished');
        worker.postMessage({ type: 'close' });
        outStream.end();
        worker.unref();
    } else if (message.channelData) {
        //const data = message.channelData.map(arrBuffer => new Float32Array(arrBuffer));

        const arrData = new ArrayBuffer(message.length * message.numChannels * 2);
        const channelData = new Int16Array(arrData);

        //console.log(arrData.byteLength, channelData.length);

        //const channelData = new Uint16Array(message.length * message.numChannels);

        //console.log(message);
        //console.log(channelData.length);

        //const readBuffer = new ArrayBuffer(message.length * message.numChannels * 4);
        //const writeView = new Float32Array(readBuffer);

        /*
        let ii = 0;
        message.channelData.forEach(arrBuffer => {
            console.log(arrBuffer);
            arrBuffer.buffer.forEach(item => {
                writeView[ii] = item;
                ii++;
            })
        });
        */

        //console.log(data);
        const dataView0 = new DataView(message.channelData[0]);
        const reader0 = new DataReader(dataView0);

        const dataView1 = new DataView(message.channelData[1]);
        const reader1 = new DataReader(dataView1);

        //console.log(reader0.remain(), reader1.remain());

        let index = 0;
        for (let i = 0; i < message.length; i++) {
            //for (let ch = 0; ch < message.numChannels; ch++) {
            //console.log(data[ch][i]);
            //console.log(ch, i, index);
            //channelData[index] = 32768 * message.channelData[ch][i];//data[ch][i];
            //channelData[index] = Math.round(32768 * data[ch][i]);
            channelData[index] = Math.round(32768 * reader0.pcm32f());
            index++;

            channelData[index] = Math.round(32768 * reader1.pcm32f());
            index++;
            //}
        }

        //console.log(reader0.remain(), reader1.remain());

        //console.log(index, channelData.length, channelData.byteLength);

        //console.log(message.length, message.numChannels, message.sampleRate);
        console.log(channelData.length, index, channelData.byteLength, message.length, message.numChannels);
        // Decoded audio samples
        //const slicedData = channelData.slice(0, index);
        //outStream.write(Buffer.from(arrData/*channelData.buffer*/, 0, arrData.byteLength / 2));
        outStream.write(Buffer.from(arrData));
        //console.log(arrData.buffer);
        //outStream.write(arrData.buffer);

        //channelData = message.channelData.map(arrBuffer => new Float32Array(arrBuffer));
    }
});
