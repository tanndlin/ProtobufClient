import { parseVarint } from '../src/decode';

describe('Decode Tests', () => {
    it('Should decode the number 150 from a buffer', () => {
        const buffer = Buffer.from([0x96, 0x01]); // field number 1, wire type 0 (varint)
        expect(parseVarint(buffer)).toBe(150); // 150 in varint encoding
    });
});
