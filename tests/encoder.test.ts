import { encodeVarint } from '../src/encode';
import ProtoMessageType from '../src/ProtoMessageType';

describe('Encoder Tests', () => {
    it('Should encode a simple message', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'int32',
                id: 1,
                optional: true,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: 150 });
        expect(buffer).toBeInstanceOf(Buffer);

        // Should equal 0x08 0x96 0x01
        expect(buffer.length).toBe(3);
        expect(buffer[0]).toBe(0x08); // field number 1, wire type 0 (varint)
        expect(buffer[1]).toBe(0x96); // 150 in varint encoding
        expect(buffer[2]).toBe(0x01); // continuation byte for varint
    });

    it('Should encode a message with 2 values', () => {
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'int32',
                id: 1,
                optional: true,
                name: 'a',
            },
            {
                type: 'int32',
                id: 2,
                optional: true,
                name: 'b',
            },
        ]);
        const buffer = message.encode({ a: 150, b: 69 });
        expect(buffer).toStrictEqual(
            Buffer.from([0x08, 0x96, 0x01, 0x10, 0x45]),
        );
    });

    it('Should encode a bool field', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'bool',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: true });
        expect(buffer).toStrictEqual(Buffer.from([0x08, 0x01]));
    });
});

describe('Encoder Helper Tests', () => {
    it.each([
        [150, [0x96, 0x01]],
        [300, [0xac, 0x02]],
        [0, [0]],
    ])('Should encode varint %d to %s', (value: number, expected: number[]) => {
        const buffer = encodeVarint(value);
        expect(buffer).toEqual(expected);
    });
});
