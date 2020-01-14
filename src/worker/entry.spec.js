import { eventHandler } from './entry';


describe('Audio web worker entry', () => {
    afterEach((done) => {
        // Close decoder handle
        eventHandler({
            data: {
                name: 'close'
            }
        }, done);
    });

    it('Unsupported event type', (done) => {
        // GIVEN unsupported decoder event type
        const config = {
            name: 'unsupported'
        };

        // WHEN initializing the decoder
        eventHandler({ data: config }, (event) => {
            // THEN error should be returned
            expect(event.error).toEqual('No event handler found for \'unsupported\'');
            done();
        });
    });

    it('Unsupported mime type', (done) => {
        // GIVEN unsupported decoder configuration data
        const config = {
            name: 'config',
            data: { mime: 'audio/pcmi' }
        };

        eventHandler({ data: { name: 'close' } }, () => {
            // WHEN initializing the decoder
            eventHandler({ data: config }, (event) => {
                // THEN error should be returned
                expect(event.error).toEqual('Unsupported mime type audio/pcmi');
                done();
            });
        });
    });

    function doubleInit(data, done) {
        // GIVEN initialized decoder
        // WHEN re-initializing decoder
        eventHandler({ data }, (event) => {
            // THEN it should fail
            expect(event.error.length > 0).toBeTruthy();
            done();
        });
    }

    function decode(done) {
        // GIVEN PCM decoding data
        const NSIZE = 4;
        const readBuffer = new ArrayBuffer(NSIZE);
        const writeView = new Uint8Array(readBuffer);

        writeView[0] = 0;
        writeView[1] = 0;
        writeView[2] = 0;
        writeView[3] = 0;

        const data = {
            name: 'decode',
            data: { decode: readBuffer }
        };

        // WHEN calling the decoder
        eventHandler({ data }, (event) => {
            // THEN it should succeed and return decoded data
            expect(event.length).toEqual(1);
            expect(event.numChannels).toEqual(2);
            expect(event.sampleRate).toEqual(44100);

            done();
        });
    }

    it('PCM decoder is initialized', (done) => {
        // GIVEN PCM decoder configuration data
        const data = {
            name: 'config',
            data: {
                mime: 'audio/pcm', samplerate: 44100, channels: 2
            }
        };

        // WHEN initializing the decoder
        eventHandler({ data }, (event) => {
            // THEN it should succeed and return decoder information
            expect(event.config.sampleRate).toEqual(44100);
            expect(event.config.numberOfChannels).toEqual(2);

            // AND decoding can be called
            decode(() => doubleInit(data, done));
        });
    });
});
