import { WavDecoder, PcmDecoder } from './wav';


// Available audio decoders according to (MIME) types
const DECODER_TYPES = {
    'audio/pcm': {
        Cls: PcmDecoder,
        samplerate: 48000,
        channels: 2
    },
    'audio/x-wav': {
        Cls: WavDecoder
    },
    'audio/wav': {
        Cls: WavDecoder
    }
};

function errorHandler(msg, callback) {
    callback({ error: msg });
}

// Handle events related to audio decoding
class AudioDecoderEventHandler {
    constructor() {
        this.decoder = null;
        this.eos = false;
    }

    // Entry point for event handling
    handleEvent(event, callback) {
        const method = `_${event.data.name}Handler`;
        if (this[method]) {
            this[method].call(this, event.data.data, callback);
            return;
        }

        errorHandler(`No event handler found for '${event.data.name}'`, callback);
    }

    // Codec configuration information
    _configHandler(data, callback) {
        const { mime } = data;

        if (this.decoder) {
            errorHandler('Decoder already available, unable to initialize', callback);
            return;
        }

        if (Object.prototype.hasOwnProperty.call(DECODER_TYPES, mime)) {
            const config = DECODER_TYPES[mime];

            // Create decoder and set sample rate and channel count, if present
            this.decoder = new config.Cls();
            if (config.samplerate) {
                const samplerate = data.samplerate || config.samplerate;
                const channels = data.channels || config.channels;
                this.decoder.setAudioConfig(samplerate, channels);
            }

            callback({ config: this.decoder.getAudioConfig() });
        } else {
            errorHandler(`Unsupported mime type ${mime}`, callback);
        }
    }

    // Decode audio to PCM output
    _decodeHandler(data, callback) {
        if (this.decoder) {
            const decoded = this.decoder.decode(data.decode);
            callback(decoded);
        }
    }

    // End of stream
    _eosHandler(data, callback) {
        this.eos = true;
        callback({ eos: true });
    }

    // Close decoder
    _closeHandler(data, callback) {
        if (this.decoder) {
            delete this.decoder;
        }

        this.decoder = null;

        callback({ closed: true });
    }
}

const decoder = new AudioDecoderEventHandler();

export function eventHandler(event, callback) {
    decoder.handleEvent(event, callback);
}
