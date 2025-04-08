import { keywords } from './Lexer';
import { ValueType, ValueTypes } from './types';

export function isValueType(value: string): value is ValueType {
    return (ValueTypes as readonly string[]).includes(value);
}

export function isKeyword(value: string): value is (typeof keywords)[number] {
    return (keywords as readonly string[]).includes(value);
}
