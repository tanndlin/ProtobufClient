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

    it('Should encode a uint32 field', () => {
        const message = new ProtoMessageType('TestMessage', [
            {
                type: 'uint32',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: 4294967295 }); // Max uint32
        expect(buffer).toStrictEqual(
            Buffer.from([0x08, 0xff, 0xff, 0xff, 0xff, 0x0f]),
        );
    });

    it('Should encode a bool field (false)', () => {
        const message = new ProtoMessageType('TestMessage', [
            {
                type: 'bool',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: false });
        expect(buffer).toStrictEqual(Buffer.from([0x08, 0x00]));
    });

    it.each([
        [-2, [0x08, 0x03]],
        [-101, [0x08, 0xc9, 0x01]],
        [0, [0x08, 0x00]],
        [1, [0x08, 0x02]],
        [2, [0x08, 0x04]],
        [3, [0x08, 0x06]],
        [4, [0x08, 0x08]],
        [5, [0x08, 0x0a]],
        [6, [0x08, 0x0c]],
        [7, [0x08, 0x0e]],
        [8, [0x08, 0x10]],
        [-1024, [0x08, 0xff, 0x0f]],
        [1024, [0x08, 0x80, 0x10]],
        [-0x80000000, [0x08, 0xff, 0xff, 0xff, 0xff, 0x0f]],
    ])(
        'Should encode an sint32 %d to %s',
        (value: number, expected: number[]) => {
            const message = new ProtoMessageType('Test1`', [
                {
                    type: 'sint32',
                    id: 1,
                    name: 'a',
                },
            ]);
            const buffer = message.encode({ a: value });
            expect(buffer).toStrictEqual(Buffer.from(expected));
        },
    );

    it.each([
        [-2, [0x08, 0x03]],
        [-101, [0x08, 0xc9, 0x01]],
        [0, [0x08, 0x00]],
        [1, [0x08, 0x02]],
        [2, [0x08, 0x04]],
        [6, [0x08, 0x0c]],
        [7, [0x08, 0x0e]],
        [8, [0x08, 0x10]],
        [-1024, [0x08, 0xff, 0x0f]],
        [1024, [0x08, 0x80, 0x10]],
        [-0x80000000, [0x08, 0xff, 0xff, 0xff, 0xff, 0x0f]],
        [-99999999999, [0x08, 0xfd, 0x9f, 0xb7, 0x87, 0x09]],
    ])(
        'Should encode an sint64 %d to %s',
        (value: number, expected: number[]) => {
            const message = new ProtoMessageType('Test1`', [
                {
                    type: 'sint32',
                    id: 1,
                    name: 'a',
                },
            ]);
            const buffer = message.encode({ a: value });
            expect(buffer).toStrictEqual(Buffer.from(expected));
        },
    );

    it('Should encode repeated fields', () => {
        //https://protobuf.dev/programming-guides/encoding/#repeated
        const message = new ProtoMessageType('Test1`', [
            {
                type: 'string',
                id: 4,
                name: 'd',
            },
            {
                type: 'int32',
                id: 6,
                name: 'e',
                repeated: true,
            },
        ]);

        const buffer = message.encode({
            d: 'hello',
            e: [1, 2, 3],
        });
        expect(buffer).toStrictEqual(
            Buffer.from([0x32, 0x06, 0x03, 0x8e, 0x02, 0x9e, 0xa7, 0x05]),
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

    it('Should encode a string field with special characters', () => {
        const message = new ProtoMessageType('TestMessage', [
            {
                type: 'string',
                id: 1,
                name: 'a',
            },
        ]);
        const buffer = message.encode({ a: 'Hello, 世界!' });
        expect(buffer).toStrictEqual(
            Buffer.from([
                0x0a, 0x0e, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0xe4,
                0xb8, 0x96, 0xe7, 0x95, 0x8c, 0x21,
            ]),
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
