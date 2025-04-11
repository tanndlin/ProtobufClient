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
        value |= bigEndian[i] & 0x7f;
        if (i < bigEndian.length - 1) {
            value <<= 7;
        }
    }

    if (valueType === 'sint32') {
        // Decode zigzag encoding for sint32
        const signBit = value & 1;
        value = value >> 1;
        if (signBit) {
            value = ~value;
        }
    }

    return { value, offset };
}
