import { keywords } from './Lexer';
import { ValueType, ValueTypes, WireType } from './types';

export function isValueType(value: string): value is ValueType {
    return (ValueTypes as readonly string[]).includes(value);
}

export function isKeyword(value: string): value is (typeof keywords)[number] {
    return (keywords as readonly string[]).includes(value);
}

export function valueTypeToWireType(valueType: ValueType): WireType {
    switch (valueType) {
        case 'bool':
        case 'int32':
        case 'sint32':
        case 'uint32':
            return WireType.Varint;
        case 'double':
            return WireType.Fixed64;
        case 'float':
            return WireType.Fixed32;
        case 'string':
            return WireType.LengthDelimited;
    }
}

export function to64Bit(value: bigint): number[] {
    const bits = [];
    for (let i = 0; i < 64; i++) {
        bits.push(Number((value >> BigInt(i)) & BigInt(1)));
    }

    return bits;
}
