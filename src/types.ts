export const ValueTypes = [
    'int32',
    'int64',
    'uint32',
    'sint32',
    'sint64',
    'float',
    'double',
    'string',
    'bool',
] as const;
export type ValueType = (typeof ValueTypes)[number];

export type ProtoField<T> = {
    name: keyof T & string;
    type: ValueType;
    id: number;
    optional?: boolean;
};

export enum WireType {
    Varint = 0,
    Fixed64 = 1,
    LengthDelimited = 2,
    StartGroup = 3,
    EndGroup = 4,
    Fixed32 = 5,
}
