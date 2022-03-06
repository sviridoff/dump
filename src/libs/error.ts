import { Code } from '@daisugi/kintsugi';
import { ResultFailure } from './result.js';

export class AppError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class Unexpected extends AppError {
  constructor(message: string) {
    super(message, Code.UnexpectedError);
  }
}

export class NotFound extends AppError {
  constructor(message: string) {
    super(message, Code.NotFound);
  }
}

export class BadRequest extends AppError {
  constructor(message: string) {
    super(message, Code.BadRequest);
  }
}

export class InvalidArgument extends AppError {
  constructor(message: string) {
    super(message, Code.InvalidArgument);
  }
}

export function unexpected(message: string) {
  return new ResultFailure(new Unexpected(message));
}

export function notFound(message: string) {
  return new ResultFailure(new NotFound(message));
}

export function badRequest(message: string) {
  return new ResultFailure(new BadRequest(message));
}

export function invalidArgument(message: string) {
  return new ResultFailure(new InvalidArgument(message));
}
