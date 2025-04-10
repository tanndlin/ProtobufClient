import ProtoMessageType from './ProtoMessageType';

const messageType = new ProtoMessageType('TestMessage', [
    {
        name: 'sint',
        id: 1,
        type: 'sint64',
    },
    {
        name: 'int',
        id: 2,
        type: 'int64',
    },
]);

console.log(
    messageType.encode({ sint: -99999999999, int: -(-99999999999) * 2 - 1 }),
);
const buffer = Buffer.from([0x08, 0xfd, 0x9f, 0xb7, 0x87, 0xe9, 0x05]);
const decoded = messageType.decode(buffer);
console.log(decoded); // { b: 'testing' }
