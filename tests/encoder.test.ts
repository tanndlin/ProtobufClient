import ProtoMessageType from '../src/ProtoMessageType';

describe('Encoder Tests', () => {
    it('Should encode a simple message', () => {
        //https://protobuf.dev/programming-guides/encoding/#simple
        const message = new ProtoMessageType('Test1`', {
            a: {
                type: 'int32',
                id: 1,
                optional: true,
                name: 'a',
            },
        });
        const buffer = message.encode({ a: 150 });
        expect(buffer).toBeInstanceOf(Buffer);

        // Should equal 0x08 0x96 0x01
        expect(buffer.length).toBe(3);
        expect(buffer[0]).toBe(0x08); // field number 1, wire type 0 (varint)
        expect(buffer[1]).toBe(0x96); // 150 in varint encoding
        expect(buffer[2]).toBe(0x01); // continuation byte for varint
    });
});
