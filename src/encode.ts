import { ValueType } from './types';
import { to64Bit } from './utils';

export function encodeVarint(value: number, valueType: ValueType): number[] {
    if (value < 0 && valueType !== 'sint32' && valueType !== 'sint64') {
        return encodeNegative(value, valueType);
    }

    if (valueType === 'sint32' || valueType === 'sint64') {
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
    if (!(valueType === 'int32' || valueType === 'int64')) {
        throw new Error(
            `Unxepected valueType. Cannot encode negative value for (type: ${valueType})`,
        );
    }

    return encodeNegativeInt(value);
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

export function encodeFixed64(value: number, valueType: ValueType): number[] {
    if (valueType === 'double') {
        return decimalTo64bitIEEE754(value);
    }

    if (valueType === 'float') {
        return decimalTo32BitIEEE754(value);
    }

    const buffer = [];
    for (let i = 0; i < 8; i++) {
        buffer.push(value & 0xff);
        value >>>= 8;
    }

    return buffer.reverse();
}

export function encodeFixed32(value: number, valueType: ValueType): number[] {
    if (valueType === 'float') {
        return decimalTo32BitIEEE754(value);
    }

    const buffer = [];
    for (let i = 0; i < 8; i++) {
        buffer.push(value & 0xff);
        value >>>= 8;
    }

    return buffer.reverse();
}

function decimalTo64bitIEEE754(value: number): number[] {
    const buffer = new ArrayBuffer(8); // 8 bytes = 64 bits
    const view = new DataView(buffer);
    view.setFloat64(0, value, false); // false = big-endian (most significant byte first)

    const bytes: number[] = [];
    for (let i = 0; i < 8; i++) {
        bytes.push(view.getUint8(i));
    }
    return bytes.reverse();
}

function decimalTo32BitIEEE754(value: number): number[] {
    const buffer = new ArrayBuffer(4); // 4 bytes = 32 bits
    const view = new DataView(buffer);
    view.setFloat32(0, value, false); // false = big-endian (most significant byte first)

    const bytes: number[] = [];
    for (let i = 0; i < 4; i++) {
        bytes.push(view.getUint8(i));
    }
    return bytes.reverse();
}

export function encodeLengthDelimited(
    bytes: Buffer<ArrayBufferLike>,
): number[] {
    const length = bytes.length;
    const lengthBuffer = encodeVarint(length, 'uint32');
    return [...lengthBuffer, ...bytes.values()];
}
