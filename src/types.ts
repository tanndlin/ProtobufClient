export const ValueTypes = ['string', 'int32'] as const;
export type ValueType = (typeof ValueTypes)[number];

export type ProtoField = {
    name: string;
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
