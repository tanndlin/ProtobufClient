import ProtoMessageType from './ProtoMessageType';

const messageType = new ProtoMessageType('TestMessage', [
    {
        name: 'a',
        id: 1,
        type: 'float',
    },
]);

const buffer = messageType.encode({ a: 1.25 });
console.log(buffer); // Buffer: 0x08 0x03
const decoded = messageType.decode(buffer);
console.log(decoded);
