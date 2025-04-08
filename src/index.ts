import ProtoMessageType from './ProtoMessageType';

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
console.log(decoded); // { b: 'testing' }
