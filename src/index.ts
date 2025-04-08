import ProtoMessageType from './ProtoMessageType';

const messageType = new ProtoMessageType('TestMessage', [
    {
        name: 'a',
        id: 1,
        type: 'sint32',
    },
]);

const buffer = messageType.encode({ a: -2 });
console.log(buffer); // Buffer: 0x08 0x03
const decoded = messageType.decode(buffer);
console.log(decoded);
