import { Result } from './result.js';

const MaybeUnitType = {
  Just: 0,
  Nothing: 1,
} as const;

type MaybeUnitType =
  typeof MaybeUnitType[keyof typeof MaybeUnitType];

export class Maybe<T> {
  #type: MaybeUnitType;
  #value: T | undefined | null;
  constructor(type: MaybeUnitType, value?: T | undefined) {
    this.#type = type;
    this.#value = value;
  }
  static #isEmpty(value: unknown) {
    return value === null || value === undefined;
  }
  map<V>(fn: (value: T) => V): Maybe<V> | Maybe<unknown> {
    if (this.isNothing()) {
      return this;
    }
    const value = fn(this.#value as T);
    return Maybe.#isEmpty(value)
      ? Maybe.nothing()
      : Maybe.just(value);
  }
  isJust() {
    return this.#type === MaybeUnitType.Just;
  }
  isNothing() {
    return this.#type === MaybeUnitType.Nothing;
  }
  toResult() {
    return this.isJust()
      ? Result.success(this.#value)
      : Result.failure(this.#value);
  }
  static just<T>(value: T) {
    if (Maybe.#isEmpty(value)) {
      throw new Error('Provided value must not be empty.');
    }
    return new Maybe(MaybeUnitType.Just, value);
  }
  static nothing() {
    return new Maybe(MaybeUnitType.Nothing);
  }
  unwrap() {
    return this.#value;
  }
}
