export const ValueTypes = ['string', 'int32'] as const;
export type ValueType = (typeof ValueTypes)[number];

export type ProtoField = {
    name: string;
    type: ValueType;
    id: number;
    optional?: boolean;
};
