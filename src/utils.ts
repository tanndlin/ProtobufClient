import { ValueType, ValueTypes } from './types';

export function isValueType(value: string): value is ValueType {
    return (ValueTypes as readonly string[]).includes(value);
}
