import ProtoMessageType from './ProtoMessageType';

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
console.log(buffer);
