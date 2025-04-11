import { TestMessage } from '../generated/benchmark';
import ProtoMessageType from '../src/ProtoMessageType';

const messageType = new ProtoMessageType('TestMessage', [
    { type: 'int32', name: 'int32', id: 1, optional: true },
    { type: 'uint32', name: 'uint32', id: 2, optional: true },
    { type: 'sint32', name: 'sint32', id: 3, optional: true },
    { type: 'float', name: 'float', id: 4, optional: true },
    { type: 'double', name: 'double', id: 5, optional: true },
    { type: 'string', name: 'string', id: 6, optional: true },
    {
        type: 'int32',
        name: 'repeatedInt32',
        id: 7,
        repeated: true,
    },
]);

describe('int32 Validation Tests Against protobuf-ts', () => {
    it.each([0, 1, 150, 300, 101, 2345, 76245642, 9283])(
        'Should encode positive int32 %d accurately',
        (input) => {
            const encoded = messageType.encode({ int32: input });
            const expected = TestMessage.toBinary({
                int32: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );

    it.each([-1, -150, -300, -101, -2345, -76245642, -9283])(
        'Should encode negative int32 %d accurately',
        (input) => {
            const encoded = messageType.encode({ int32: input });
            const expected = TestMessage.toBinary({
                int32: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );
});

describe('uint32 Validation Tests Against protobuf-ts', () => {
    it.each([0, 1, 150, 300, 101, 2345, 76245642, 9283])(
        'Should encode positive uint32 %d accurately',
        (input) => {
            const encoded = messageType.encode({ uint32: input });
            const expected = TestMessage.toBinary({
                uint32: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );
});

describe('sint32 Validation Tests Against protobuf-ts', () => {
    it.each([0, 1, 150, 300, 101, 2345, 76245642, 9283])(
        'Should encode positive sint32 %d accurately',
        (input) => {
            const encoded = messageType.encode({ sint32: input });
            const expected = TestMessage.toBinary({
                sint32: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );

    it.each([-1, -150, -300, -101, -2345, -76245642, -9283])(
        'Should encode negative sint32 %d accurately',
        (input) => {
            const encoded = messageType.encode({ sint32: input });
            const expected = TestMessage.toBinary({
                sint32: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );
});

describe('float Validation Tests Against protobuf-ts', () => {
    it.each([0.0, 0.1, 0.15, 0.3, 0.101, 0.2345, 0.76245642, 0.9283])(
        'Should encode positive float %d accurately',
        (input) => {
            const encoded = messageType.encode({ float: input });
            const expected = TestMessage.toBinary({
                float: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );

    it.each([-0.1, -0.15, -0.3, -0.101, -0.2345, -0.76245642, -0.9283])(
        'Should encode negative float %d accurately',
        (input) => {
            const encoded = messageType.encode({ float: input });
            const expected = TestMessage.toBinary({
                float: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );
});

describe('double Validation Tests Against protobuf-ts', () => {
    it.each([0.0, 0.1, 0.15, 0.3, 0.101, 0.2345, 0.76245642, 0.9283])(
        'Should encode positive double %d accurately',
        (input) => {
            const encoded = messageType.encode({ double: input });
            const expected = TestMessage.toBinary({
                double: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );

    it.each([-0.1, -0.15, -0.3, -0.101, -0.2345, -0.76245642, -0.9283])(
        'Should encode negative double %d accurately',
        (input) => {
            const encoded = messageType.encode({ double: input });
            const expected = TestMessage.toBinary({
                double: input,
                repeatedInt32: [],
            });

            expect(encoded).toEqual(expected);
        },
    );
});

describe('string Validation Tests Against protobuf-ts', () => {
    it.each([
        '0.76245642',
        '',
        'Hello World!',
        'This is a really long test message',
    ])('Should encode positive string %d accurately', (input) => {
        const encoded = messageType.encode({ string: input });
        const expected = TestMessage.toBinary({
            string: input,
            repeatedInt32: [],
        });

        expect(encoded).toEqual(expected);
    });
});

describe('repeatedInt32 Validation Tests Against protobuf-ts', () => {
    it.each([
        { input: [0] },
        { input: [1] },
        { input: [1, 150, 300, 101, 2345, 76245642, 9283] },
    ])('Should encode positive repeatedInt32 %s accurately', ({ input }) => {
        const encoded = messageType.encode({ repeatedInt32: input });
        const expected = TestMessage.toBinary({
            repeatedInt32: input,
        });

        expect(encoded).toEqual(expected);
    });

    it.each([{ input: [-1, -150, -300, -101, -2345, -76245642, -9283] }])(
        'Should encode negative repeatedInt32 %s accurately',
        ({ input }) => {
            const encoded = messageType.encode({ repeatedInt32: input });
            const expected = TestMessage.toBinary({
                repeatedInt32: input,
            });

            expect(encoded).toEqual(expected);
        },
    );
});
