import ProtoMessageType from './ProtoMessageType';

const buffer = Buffer.from([0x08, 0x96, 0x01, 0x10, 0x45]); // field number 1, wire type 0 (varint)
const messageType = new ProtoMessageType('TestMessage', [
    {
        name: 'a',
        id: 1,
        type: 'sint32',
    },
]);

console.log(messageType.encode({ a: 0x7fffffff }));

const decoded = messageType.decode(buffer);
console.log(decoded);
