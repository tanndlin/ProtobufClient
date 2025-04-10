import { ValueType } from './types';

export function decodeVarint(
    buffer: Buffer,
    offset: number,
    valueType: ValueType,
) {
    const bytes = [];
    while (offset < buffer.length) {
        const byte = buffer[offset++];
        const msb = byte & 0x80;
        if (msb === 0) {
            bytes.push(byte);
            break;
        }
        bytes.push(byte & 0x7f);
    }

    let value = 0;
    const bigEndian = bytes.reverse();
    // Concat the bits into a single number
    for (let i = 0; i < bigEndian.length; i++) {
        value |= (bigEndian[i] & 0x7f) << (7 * (bigEndian.length - 1 - i));
    }

    if (valueType === 'sint32' || valueType === 'sint64') {
        // Decode zigzag encoding for sint32 and sint64
        const signBit = value & 1;
        value = value >> 1;
        if (signBit) {
            value = ~value;
        }
    }

    return { value, offset };
}
