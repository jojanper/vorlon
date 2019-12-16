import { WavDecoder, PcmDecoder, getWavFmtInfo } from './wav';
import { DataReader } from './data';

const NSIZE = 48;
const readBuffer = new ArrayBuffer(NSIZE);
const writeView = new Uint8Array(readBuffer);

// Add 'fmt' chunk data
function fillFmtInfo(view, offset, formatId = 1) {
    // Format ID
    view[offset + 0] = formatId;
    view[offset + 1] = 0;

    // Number of channels (2)
    view[offset + 2] = 2;
    view[offset + 3] = 0;

    // Sample rate (48000)
    view[offset + 4] = 128;
    view[offset + 5] = 187;
    view[offset + 6] = 0;
    view[offset + 7] = 0;

    // Byte rate
    view[offset + 8] = 0;
    view[offset + 9] = 0;
    view[offset + 10] = 0;
    view[offset + 11] = 0;

    // Block size
    view[offset + 12] = 4;
    view[offset + 13] = 0;

    // Bit depth
    view[offset + 14] = 16;
    view[offset + 15] = 0;

    return offset + 16;
}

// Add RIFF tag to buffer
function fillRIFFInfo(view, offset) {
    view[offset + 0] = 'R'.charCodeAt(0);
    view[offset + 1] = 'I'.charCodeAt(0);
    view[offset + 2] = 'F'.charCodeAt(0);
    view[offset + 3] = 'F'.charCodeAt(0);
    return offset + 4;
}

// Add WAVE tag to buffer
function fillWAVEInfo(view, offset) {
    view[offset + 0] = 'W'.charCodeAt(0);
    view[offset + 1] = 'A'.charCodeAt(0);
    view[offset + 2] = 'V'.charCodeAt(0);
    view[offset + 3] = 'E'.charCodeAt(0);
    return offset + 4;
}

function createTestWavHeader(view) {
    let offset = 0;

    // RIFF
    offset = fillRIFFInfo(view, offset);
    view[offset + 1] = 0;
    view[offset + 2] = 0;
    view[offset + 3] = 0;
    view[offset + 4] = 1;

    // WAVE
    offset = fillWAVEInfo(view, offset + 4);

    // 'fmt' chunk
    view[offset + 0] = 'f'.charCodeAt(0);
    view[offset + 1] = 'm'.charCodeAt(0);
    view[offset + 2] = 't'.charCodeAt(0);
    view[offset + 3] = ' '.charCodeAt(0);
    view[offset + 4] = 0;
    view[offset + 5] = 0;
    view[offset + 6] = 0;
    view[offset + 7] = 0;

    // Data for 'fmt'
    const original = offset + 8;
    offset = fillFmtInfo(view, original);
    view[original - 4] = offset - original;

    // 'data' chunk
    view[offset + 0] = 'd'.charCodeAt(0);
    view[offset + 1] = 'a'.charCodeAt(0);
    view[offset + 2] = 't'.charCodeAt(0);
    view[offset + 3] = 'a'.charCodeAt(0);
    view[offset + 4] = 4;
    view[offset + 5] = 0;
    view[offset + 6] = 0;
    view[offset + 7] = 0;

    return offset;
}

describe('PcmDecoder', () => {
    beforeAll(() => {
        writeView[0] = 3;
        writeView[1] = 2;
        writeView[2] = 8;
        writeView[3] = 0;
        writeView[4] = 1;
        writeView[5] = 2;
    });

    it('decode 16-bit audio', () => {
        const obj = new PcmDecoder();
        obj.setAudioConfig(48000, 3);

        const config = obj.getAudioConfig();
        expect(config.sampleRate).toEqual(48000);
        expect(config.numberOfChannels).toEqual(3);

        const result = obj.decode(readBuffer);
        const audio = result.channelData.map(arrBuffer => new Float32Array(arrBuffer));

        expect(result.length).toEqual(8); // Audio samples available
        expect(result.numChannels).toEqual(3);
        expect(result.sampleRate).toEqual(48000);
        expect(result.channelData.length).toEqual(3);

        expect(audio[0][0]).toEqual((2 * 256 + 3) / 32768);
        expect(audio[1][0]).toEqual((0 * 256 + 8) / 32768);
        expect(audio[2][0]).toEqual((2 * 256 + 1) / 32768);
    });
});

describe('WavDecoder', () => {
    let obj;
    let dataView;
    let reader;

    beforeEach(() => {
        obj = new WavDecoder();
        dataView = new DataView(readBuffer);
        reader = new DataReader(dataView);
    });

    it('no RIFF', () => {
        // GIVEN invalid tag in the header
        writeView[0] = 'R'.charCodeAt(0);
        writeView[1] = 'A'.charCodeAt(0);
        writeView[2] = 'F'.charCodeAt(0);
        writeView[3] = 'F'.charCodeAt(0);

        // WHEN parsing the header
        // THEN error should be thrown
        expect(() => obj.decode(readBuffer)).toThrowError(Error, 'Invalid WAV, no RIFF found');
    });

    it('no WAVE', () => {
        fillRIFFInfo(writeView, 0);

        writeView[4] = 0;
        writeView[5] = 0;
        writeView[6] = 0;
        writeView[7] = 1;

        // GIVEN 'WAVE' tag is missing from header
        writeView[8] = 'W'.charCodeAt(0);
        writeView[9] = 'A'.charCodeAt(0);
        writeView[10] = 'V'.charCodeAt(0);
        writeView[11] = 'I'.charCodeAt(0);

        // WHEN parsing the header
        // THEN error should be thrown
        expect(() => obj.decode(readBuffer)).toThrowError(Error, 'Invalid WAV, no WAVE found');
    });

    it('data chunk is missing', () => {
        // GIVEN WAV header with no data chunk
        const offset = createTestWavHeader(writeView);
        writeView[offset + 0] = 'd'.charCodeAt(0);
        writeView[offset + 1] = 'a'.charCodeAt(0);
        writeView[offset + 2] = 't'.charCodeAt(0);
        writeView[offset + 3] = 't'.charCodeAt(0);
        writeView[offset + 4] = 4;
        writeView[offset + 5] = 0;
        writeView[offset + 6] = 0;
        writeView[offset + 7] = 0;

        // WHEN parsing the header
        // THEN error should be thrown
        expect(() => obj.init(reader)).toThrowError(Error, 'Invalid WAV, no data chunk found');
    });

    it('WAV header is read', () => {
        // GIVEN valid WAV header
        createTestWavHeader(writeView);

        // WHEN parsing the header
        // THEN it should succeed
        expect(obj.init(reader)).toBeTruthy();

        // AND correct reader method is selected
        expect(obj.readerMethodName).toEqual('pcm16');

        // WHEN parsing the header again
        // THEN it should fail as header is already parsed
        expect(obj.init(reader)).toBeFalsy();
    });
});

describe('getWavFmtInfo', () => {
    let dataView;
    let reader;

    beforeEach(() => {
        dataView = new DataView(readBuffer);
        reader = new DataReader(dataView);
    });

    afterEach(() => {
        writeView.fill(0);
    });

    it('unsupported format is found', () => {
        writeView[0] = 0;
        writeView[1] = 1;

        expect(() => getWavFmtInfo(reader, 2)).toThrowError(Error, 'Unsupported format in WAV: 0x100');
    });

    it('fmt chunk is parsed', () => {
        // GIVEN valid fmt data
        const size = fillFmtInfo(writeView, 0);

        // WHEN parsing the data
        const info = getWavFmtInfo(reader, size);

        // THEN it should succeed and return valid data
        expect(info.formatId).toEqual(1);
        expect(info.floatingPoint).toBeFalsy();
        expect(info.numberOfChannels).toEqual(2);
        expect(info.sampleRate).toEqual(48000);
        expect(info.byteRate).toEqual(0);
        expect(info.blockSize).toEqual(4);
        expect(info.bitDepth).toEqual(16);
        expect(info.readerMethodName).toEqual('pcm16');

        reader.reset();
    });

    it('64-bit sample depth is not supported', () => {
        // GIVEN invalid bit depth
        const size = fillFmtInfo(writeView, 0);
        writeView[14] = 64;
        writeView[15] = 0;

        // WHEN parsing data
        // THEN error should be thrown
        expect(() => getWavFmtInfo(reader, size)).toThrowError(Error, 'Unsupported bit depth in WAV: 64 (pcm64)');
    });

    it('16-bit floating point sample depth is not supported', () => {
        // GIVEN floating point fmt data
        const size = fillFmtInfo(writeView, 0, 3);

        // WHEN parsing data
        // THEN error should be thrown
        expect(() => getWavFmtInfo(reader, size)).toThrowError(Error, 'Unsupported bit depth in WAV: 16 (pcm16f)');
    });
});
