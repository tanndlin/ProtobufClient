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

    it('Should decode a negative number', () => {
        const buffer = Buffer.from([
            0x08, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01,
        ]);
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'int32',
            },
        ]);

        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(-2);
    });

    it('Should decode a bool field', () => {
        const buffer = Buffer.from([0x08, 0x01]);
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'bool',
            },
        ]);

        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(true);
    });
});

describe('Decode Helper Tests', () => {
    it('Should decode the number 150 from a buffer', () => {
        const buffer = Buffer.from([0x96, 0x01]);
        expect(decodeVarint(buffer, 0, 'uint32').value).toBe(150);
    });

    it('Should decode the -2 int from a buffer', () => {
        const buffer = Buffer.from([
            0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01,
        ]);
        expect(decodeVarint(buffer, 0, 'int32').value).toBe(-2);
    });

    it.each([
        [[0x01], -1],
        [[0x03], -2],
        [[0x05], -3],
        [[0x07], -4],
        [[0x09], -5],
    ])('Should decode negative sint %d from a buffer', (input, expected) => {
        const buffer = Buffer.from(input);
        expect(decodeVarint(buffer, 0, 'sint32').value).toBe(expected);
    });

    it.each([
        [[0x02], 1],
        [[0x04], 2],
        [[0x06], 3],
        [[0x08], 4],
        [[0x0a], 5],
    ])('Should decode positive sint %d from a buffer', (input, expected) => {
        const buffer = Buffer.from(input);
        expect(decodeVarint(buffer, 0, 'sint32').value).toBe(expected);
    });
});
