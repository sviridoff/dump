import { Code } from '@daisugi/kintsugi';
import { ResultFailure } from './Result.js';

export class AppError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);

    this.code = code;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class Unexpected extends ResultFailure<AppError> {
  constructor(message: string) {
    super(new AppError(message, Code.UnexpectedError));
  }
}

export class NotFound extends ResultFailure<AppError> {
  constructor(message: string) {
    super(new AppError(message, Code.NotFound));
  }
}

export class BadRequest extends ResultFailure<AppError> {
  constructor(message: string) {
    super(new AppError(message, Code.BadRequest));
  }
}

export class InvalidArgument extends ResultFailure<AppError> {
  constructor(message: string) {
    super(new AppError(message, Code.InvalidArgument));
  }
}
