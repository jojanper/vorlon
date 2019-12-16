import { DataReader } from './data';


const NSIZE = 32;
const readBuffer = new ArrayBuffer(NSIZE);
const writeView = new Uint8Array(readBuffer);
writeView[0] = 3;
writeView[1] = 2;
writeView[2] = 8;
writeView[3] = 65; // a
writeView[4] = 66; // b
writeView[5] = 1;
writeView[6] = 1;
writeView[7] = 1;

const dataView = new DataView(readBuffer);

describe('DataReader', () => {
    let reader;

    beforeEach(() => {
        reader = new DataReader(dataView);
    });

    it('works', () => {
        const obj = new DataReader();
        expect(obj).toBeDefined();
    });

    it('remain', () => {
        expect(reader.remain()).toEqual(NSIZE);
    });

    it('skip', () => {
        reader.skip(2);
        expect(reader.remain()).toEqual(NSIZE - 2);
    });

    it('reset', () => {
        reader.skip(2);
        reader.reset();
        expect(reader.remain()).toEqual(NSIZE);
    });

    it('uint8', () => {
        expect(reader.uint8()).toEqual(3);
        expect(reader.uint8()).toEqual(2);
        expect(reader.uint8()).toEqual(8);
    });

    it('uint16', () => {
        expect(reader.uint16()).toEqual(2 * 256 + 3);
    });

    it('string', () => {
        reader.skip(3);
        expect(reader.string(2)).toEqual('AB');
    });

    it('pcm16', () => {
        expect(reader.pcm16()).toEqual((2 * 256 + 3) / 32768); // little endian
        reader.skip(-2);
        expect(reader.pcm16(false)).toEqual((3 * 256 + 2) / 32768); // big endian
    });

    it('pcm24', () => {
        expect(reader.pcm24()).toEqual((8 * 256 * 256 + 2 * 256 + 3) / 8388608);
    });

    it('pcm32', () => {
        expect(reader.pcm32()).toEqual((65 * 256 * 256 * 256 + 8 * 256 * 256 + 2 * 256 + 3) / 2147483648);
        reader.skip(-4);
        expect(reader.pcm32(false)).toEqual((3 * 256 * 256 * 256 + 2 * 256 * 256 + 8 * 256 + 65) / 2147483648);
    });

    it('pcm32f', () => {
        expect(reader.pcm32f()).toEqual(8.50049114227295);
        reader.skip(-4);
        expect(reader.pcm32f(false)).toEqual(3.821304142142072e-37);
    });

    it('pcm64f', () => {
        expect(reader.pcm64f()).toEqual(7.749057892698925e-304);
        reader.skip(-8);
        expect(reader.pcm64f(false)).toEqual(3.529263320599377e-294);
    });
});
