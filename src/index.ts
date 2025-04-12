import { TestMessage } from '../generated/benchmark';
import ProtoMessageType from './ProtoMessageType';

//https://protobuf.dev/programming-guides/encoding/#repeated
const message = new ProtoMessageType('Test1`', [
    {
        type: 'int32',
        id: 7,
        name: 'repeatedInt32',
        repeated: true,
    },
]);

const encoded = message.encode({ repeatedInt32: [0] });
const expected = TestMessage.toBinary({
    repeatedInt32: [0],
});

console.log(encoded);
console.log(expected);
