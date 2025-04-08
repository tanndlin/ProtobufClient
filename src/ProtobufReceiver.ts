import ProtoMessageType from './ProtoMessageType';

export function parseBuffer<T extends ProtoMessageType<any>>(
    buffer: Buffer,
    messageType: new (...args: any[]) => T,
): T {
    const message = new messageType();
    const fields = Object.keys(message.fields) as Array<keyof T & string>;
    const values = buffer.toString().split(',');

    if (fields.length !== values.length) {
        throw new Error('Buffer length does not match message fields length.');
    }

    fields.forEach((field, index) => {
        message.fields[field] = values[index] as any;
    });

    return message;
}
