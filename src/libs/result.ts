/*
const ResultUnitType = {
  Success: 0,
  Error: 1,
} as const;

type ResultUnitType =
  typeof ResultUnitType[keyof typeof ResultUnitType];

export class Result<T, U> {
  #type: ResultUnitType;
  #error: U;
  #value: T;
  constructor(type: ResultUnitType, value: T, error: U) {
    this.#type = type;
    this.#value = value;
    this.#error = error;
  }
  static success<T>(value: T) {
    return new Result(ResultUnitType.Success, value, null);
  }
  static failure<U>(error: U) {
    return new Result(ResultUnitType.Error, null, error);
  }
  isSuccess() {
    return this.#type === ResultUnitType.Success;
  }
  isFailure() {
    return this.#type === ResultUnitType.Error;
  }
  getValue() {
    if (this.isFailure()) {
      throw new Error('Cannot get the value of failure.');
    }
    return this.#value;
  }
  getError() {
    if (this.isSuccess()) {
      throw new Error('Cannot get the error of success.');
    }
    return this.#error;
  }
  toJSON() {
    return JSON.stringify({
      type: this.#type,
      value: this.#value,
      error: this.#error,
    });
  }
  static fromThrowable() {
    // TODO
  }
  static fromJSON(json: string) {
    const object = JSON.parse(json);
    return object.type === ResultUnitType.Success
      ? Result.success(object.getValue())
      : Result.failure(object.getError());
  }
  map<V>(fn: (value: T) => V) {
    if (this.isFailure()) {
      return this;
    }
    return Result.success(fn(this.#value));
  }
  chain<V>(fn: (value: T) => V) {
    if (this.isFailure()) {
      return this;
    }
    return fn(this.#value);
  }
  elseMap<V>(fn: (value: U) => V) {
    if (this.isSuccess()) {
      return this;
    }
    return Result.success(fn(this.#error));
  }
  elseChain<V>(fn: (value: U) => V) {
    if (this.isSuccess()) {
      return this;
    }
    return fn(this.#error);
  }
  unsafeUnwrap() {
    return this.isSuccess() ? this.#value : this.#error;
  }
  unwrapOr<V>(fn: (value: U) => V) {
    if (this.isSuccess()) {
      this.#value;
    }
    return fn(this.#error);
  }
}
*/

export class ResultSuccess<T> {
  isSuccess = true as const;
  isFailure = false as const;
  #value: T;
  constructor(value: T) {
    this.#value = value;
  }
  getValue() {
    return this.#value;
  }
  getError() {
    throw new Error('Cannot get the error of success.');
  }
}

export class ResultFailure<T> {
  isSuccess = false as const;
  isFailure = true as const;
  #error: T;
  constructor(error: T) {
    this.#error = error;
  }
  getValue() {
    throw new Error('Cannot get the value of failure.');
  }
  getError() {
    return this.#error;
  }
}

export class Result {
  static success<T>(value: T) {
    return new ResultSuccess<T>(value);
  }
  static failure<T>(error: T) {
    return new ResultFailure<T>(error);
  }
}
