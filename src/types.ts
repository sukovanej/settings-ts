const integerS = Symbol("integer");

export type Integer = number & { _brand: typeof integerS };

const positiveIntegerS = Symbol("positiveInteger");

export type PositiveInteger = Integer & { _brand: typeof positiveIntegerS };

const integerRangeS = Symbol("integerRange");

export type IntegerRange<L, U> = Integer & {
  _brand: typeof integerRangeS;
  _lowerBound: L;
  _upperBound: U;
};

export type Port = IntegerRange<0, 65536>;
