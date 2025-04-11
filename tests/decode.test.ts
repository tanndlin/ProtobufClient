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

    it('Should decode a double field', () => {
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'double',
            },
        ]);

        const buffer = Buffer.from([
            0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf4, 0x3f,
        ]);
        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(1.25);
    });

    it('Should decode a float field', () => {
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'a',
                id: 1,
                type: 'float',
            },
        ]);

        const buffer = Buffer.from([0x0d, 0x00, 0x00, 0xa0, 0x3f]);
        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('a');
        expect(decoded.a).toBe(1.25);
    });

    it('Should decode a string field', () => {
        const messageType = new ProtoMessageType('TestMessage', [
            {
                name: 'b',
                id: 2,
                type: 'string',
            },
        ]);

        const buffer = Buffer.from([
            0x12, 0x07, 0x74, 0x65, 0x73, 0x74, 0x69, 0x6e, 0x67,
        ]);
        const decoded = messageType.decode(buffer);
        expect(decoded).toHaveProperty('b');
        expect(decoded.b).toBe('testing');
    });

    it.each([
        [[0x08, 0x03], -2],
        [[0x08, 0xc9, 0x01], -101],
        [[0x08, 0x00], 0],
        [[0x08, 0x02], 1],
        [[0x08, 0x04], 2],
        [[0x08, 0x0c], 6],
        [[0x08, 0x0e], 7],
        [[0x08, 0x10], 8],
        [[0x08, 0xff, 0x0f], -1024],
        [[0x08, 0x80, 0x10], 1024],
    ])(
        'Should decode an sint32 %s to %d',
        (buffer: number[], expected: number) => {
            const message = new ProtoMessageType('Test1`', [
                {
                    type: 'sint32',
                    id: 1,
                    name: 'a',
                },
            ]);
            const decoded = message.decode(Buffer.from(buffer));
            expect(decoded).toHaveProperty('a');
            expect(decoded.a).toBe(expected);
        },
    );
});

describe('Decode Helper Tests', () => {
    it.each([
        { input: [0x08, 0x96, 0x01], expected: 150 },
        { input: [0x08, 0xac, 0x02], expected: 300 },
        { input: [0x08, 0x00], expected: 0 },
        { input: [0x08, 0x01], expected: 1 },
    ])('Should decode uint32 %s from a buffer', () => {
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
    ])('Should decode negative sint32 %d from a buffer', (input, expected) => {
        const buffer = Buffer.from(input);
        expect(decodeVarint(buffer, 0, 'sint32').value).toBe(expected);
    });

    it.each([
        [[0x02], 1],
        [[0x04], 2],
        [[0x06], 3],
        [[0x08], 4],
        [[0x0a], 5],
    ])('Should decode positive sint32 %d from a buffer', (input, expected) => {
        const buffer = Buffer.from(input);
        expect(decodeVarint(buffer, 0, 'sint32').value).toBe(expected);
    });
});
