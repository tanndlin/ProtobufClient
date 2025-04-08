import { ValueType } from './types';
import { to64Bit } from './utils';

export function encodeVarint(value: number, valueType: ValueType): number[] {
    if (value < 0 && valueType !== 'sint32') {
        return encodeNegative(value, valueType);
    }

    if (valueType === 'sint32') {
        if (value < 0) {
            value = -value * 2 - 1;
        } else {
            value *= 2;
        }
    }

    const buffer: number[] = [];
    while (value > 0x7f) {
        buffer.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    buffer.push(value & 0x7f);
    return buffer;
}

function encodeNegative(value: number, valueType: ValueType): number[] {
    switch (valueType) {
        case 'uint32':
            throw new Error(`Cannot encode negative as uint (value: ${value})`);
        case 'int32':
            return encodeNegativeInt(value);
        default:
            throw new Error(`Unxepected valueType: (type: ${valueType})`);
    }
}

function encodeNegativeInt(value: number): number[] {
    // 2's complement for int32 and int64
    const bits = to64Bit(BigInt(value));
    const buffer: number[] = [];
    for (let b = 0; b < 10; b++) {
        let byte = b < 9 ? 0x80 : 0x00;
        for (let i = 0; i < 7; i++) {
            byte |= bits[b * 7 + i] << i;
        }

        buffer.push(byte);
    }

    return buffer;
}
