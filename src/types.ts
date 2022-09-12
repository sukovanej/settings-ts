const integerS = Symbol("integer");

export type Integer = number & { _brand: typeof integerS };
