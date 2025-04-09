import { encodeVarint } from '../src/encode';
import ProtoMessageType from '../src/ProtoMessageType';
import { ValueType } from '../src/types';

describe('Encoder Tests', () => {
    it('Should encode a simple message', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'uint32',
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
                type: 'uint32',
                id: 1,
                optional: true,
                name: 'a',
            },
            {
                type: 'uint32',
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

    it('Should encode a negative sint32', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'int32',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: -2 });
        expect(buffer).toStrictEqual(
            Buffer.from([
                0x08, 0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                0x01,
            ]),
        );
    });

    it('Should encode a double messsage field', () => {
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'double',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: 1.25 });
        expect(buffer).toStrictEqual(
            Buffer.from([0x09, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf4, 0x3f]),
        );
    });

    it('Should encode a float messsage field', () => {
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'float',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: 1.25 });
        expect(buffer).toStrictEqual(
            Buffer.from([0x0d, 0x00, 0x00, 0xa0, 0x3f]),
        );
    });

    it('Should encode a string messsage field', () => {
        const message = new ProtoMessageType('Test2`', [
            {
                type: 'string',
                id: 2,
                name: 'b',
            },
        ]);
        const buffer = message.encode({ b: 'testing' });
        expect(buffer).toStrictEqual(
            Buffer.from([0x12, 0x07, 0x74, 0x65, 0x73, 0x74, 0x69, 0x6e, 0x67]),
        );
    });
});

describe('Encoder Helper Tests', () => {
    it.each([
        ['uint32' as const, 150, [0x96, 0x01]],
        ['uint32' as const, 300, [0xac, 0x02]],
        ['uint32' as const, 0, [0]],
    ])(
        'Should encode %s %d to %s',
        (valueType: ValueType, value: number, expected: number[]) => {
            const buffer = encodeVarint(value, valueType);
            expect(buffer).toEqual(expected);
        },
    );

    it.each([
        ['int32' as const, 150, [0x96, 0x01]],
        ['int32' as const, 300, [0xac, 0x02]],
        ['int32' as const, 0, [0]],
        [
            'int32' as const,
            -2,
            [0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01],
        ],
        [
            'int64' as const,
            -2,
            [0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01],
        ],
    ])(
        'Should encode %s %d to %s',
        (valueType: ValueType, value: number, expected: number[]) => {
            const buffer = encodeVarint(value, valueType);
            expect(buffer).toEqual(expected);
        },
    );

    it.each([
        ['sint32' as const, 0, 0],
        ['sint32' as const, -1, 1],
        ['sint32' as const, 1, 2],
        ['sint32' as const, -2, 3],
        ['sint32' as const, 2, 4],
        ['sint32' as const, 0x7fffffff, 0xfffffffe],
        ['sint32' as const, -0x80000000, 0xffffffff],
    ])(
        'Should encode %s %d as uint %d',
        (valueType: ValueType, value: number, encodeAs: number) => {
            const expected = encodeVarint(encodeAs, 'uint32');
            const buffer = encodeVarint(value, valueType);
            expect(buffer).toEqual(expected);
        },
    );

    it('Should throw for encoding negative uint', () => {
        expect(() => encodeVarint(-1, 'uint32')).toThrow(
            'Unxepected valueType. Cannot encode negative value for (type: uint32)',
        );
    });
});
