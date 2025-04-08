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
        case 'int32':
            return WireType.Varint;
        case 'string':
            return WireType.LengthDelimited;
    }
}
