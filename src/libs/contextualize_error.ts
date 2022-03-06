import { ResultFailure } from './result.js';
import { AppError } from './error.js';

export function contextualizeError<
  T extends ResultFailure<AppError>,
>(resultFail: T, prefixMessage: string) {
  resultFail.getError().message = `${prefixMessage} ${
    resultFail.getError().message
  }.`;
  return resultFail;
}
