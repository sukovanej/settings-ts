const integerS = Symbol("integer");

export type Integer = number & { _brand: typeof integerS };

const positiveIntegerS = Symbol("integer");

export type PositiveInteger = Integer & { _brand: typeof positiveIntegerS };
