import { decodeVarint } from '../src/decode';
import ProtoMessageType from '../src/ProtoMessageType';

describe('Decoder Tests', () => {
    it('Should decode a simple message', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const buffer = Buffer.from([0x08, 0x96, 0x01]); // field number 1, wire type 0 (varint)
        const messageType = new ProtoMessageType<{ a: number }>('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'int32',
            },
        ]);

        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(150);
    });

    it('Should decode a message with 2 fields', () => {
        const buffer = Buffer.from([0x08, 0x96, 0x01, 0x10, 0x45]);
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'int32',
            },
            {
                name: 'b',
                id: 2,
                type: 'int32',
            },
        ]);

        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(150);
        expect(decoded).toHaveProperty('b');
        expect(decoded.b).toBe(69);
    });
});

describe('Decode Helper Tests', () => {
    it('Should decode the number 150 from a buffer', () => {
        const buffer = Buffer.from([0x96, 0x01]); // field number 1, wire type 0 (varint)
        expect(decodeVarint(buffer, 0).value).toBe(150); // 150 in varint encoding
    });
});
