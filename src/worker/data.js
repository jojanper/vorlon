/* eslint-disable no-bitwise */

export class DataReader {
    constructor(dataView) {
        this.view = dataView;
        this.pos = 0;
    }

    _getData(method, nbytes, littleEndian) {
        const data = this.view[method](this.pos, littleEndian);
        this.pos += nbytes;
        return data;
    }

    reset() {
        this.pos = 0;
    }

    remain() {
        return this.view.byteLength - this.pos;
    }

    skip(n) {
        this.pos += n;
    }

    uint8() {
        return this._getData('getUint8', 1, false);
    }

    uint32(bigEndian = true) {
        return this._getData('getUint32', 4, bigEndian);
    }

    uint16(bigEndian = true) {
        return this._getData('getUint16', 2, bigEndian);
    }

    string(n) {
        let data = '';
        for (let i = 0; i < n; i++) {
            data += String.fromCharCode(this.uint8());
        }

        return data;
    }

    pcm16(littleEndian = true) {
        const data = this._getData('getInt16', 2, littleEndian);
        return data / 32768;
    }

    pcm24() {
        const x0 = this.view.getUint8(this.pos + 0);
        const x1 = this.view.getUint8(this.pos + 1);
        const x2 = this.view.getUint8(this.pos + 2);
        const xx = (x0 + (x1 << 8) + (x2 << 16));
        this.pos += 3;
        return xx / 8388608;
    }

    pcm32(littleEndian = true) {
        const data = this.view.getInt32(this.pos, littleEndian);
        this.pos += 4;
        return data / 2147483648;
    }

    pcm32f(littleEndian = true) {
        const data = this.view.getFloat32(this.pos, littleEndian);
        this.pos += 4;
        return data;
    }

    pcm64f(littleEndian = true) {
        const data = this.view.getFloat64(this.pos, littleEndian);
        this.pos += 8;
        return data;
    }
}
