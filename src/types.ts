export const ValueTypes = ['string', 'int32'] as const;
export type ValueType = (typeof ValueTypes)[number];
