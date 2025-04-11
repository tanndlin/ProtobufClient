import ProtoMessageType from './ProtoMessageType';

const messageType = new ProtoMessageType('TestMessage', [
    {
        name: 'a',
        id: 1,
        type: 'int32',
    },
]);

const encoded = messageType.encode({ a: -15 });
console.log(encoded);
const decoded = messageType.decode(encoded);
console.log(decoded); // { b: 'testing' }
