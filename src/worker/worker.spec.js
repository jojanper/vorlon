import { EventReceiver, EVENTS } from './events';

describe('Audio web worker', () => {
    let worker;
    let receiver;

    beforeEach(() => {
        worker = new Worker('/base/src/worker/worker.js');
        receiver = new EventReceiver(worker);
    });

    afterEach(() => {
        worker.terminate();
        receiver.clear();
    });

    it('decoding fails', (done) => {
        // GIVEN PCM decoder has been initialized
        worker.postMessage({
            name: 'config',
            data: { mime: 'audio/pcm' }
        });

        receiver.on(EVENTS.WORKER_ERROR, (err) => {
            // THEN decoding should fail
            expect(err).toBeDefined();
            done();
        });

        // WHEN invalid data is sent to PCM decoder
        worker.postMessage({
            name: 'decode',
            data: { decode: [] }
        });
    });

    it('unsupported mime type', (done) => {
        // GIVEN invalid mime type has been specified for the codec
        const data = {
            name: 'config',
            data: { mime: 'foo' }
        };

        // WHEN initializing decoder
        worker.postMessage(data);

        receiver.on(EVENTS.ERROR, (message) => {
            // THEN error message should be received
            expect(message).toEqual('Unsupported mime type foo');
            done();
        });
    });

    it('decoder init data is set', (done) => {
        receiver.on(EVENTS.CONFIG, (config) => {
            // THEN message should be sent to indicate successfull initialization
            expect(config.sampleRate).toEqual(48000);
            expect(config.numberOfChannels).toEqual(2);
            done();
        });

        // GIVEN PCM decoder configuration data
        const data = {
            name: 'config',
            data: { mime: 'audio/pcm', samplerate: 48000, channels: 2 }
        };

        // WHEN initializing the decoder
        worker.postMessage(data);
    });
});
