import { ResultFailure } from '../libs/Result.js';
import { AppError } from '../libs/Error.js';

export function contextualizeError<
  T extends ResultFailure<AppError>,
>(resultFail: T, prefixMessage: string) {
  resultFail.getError().message = `${prefixMessage} ${
    resultFail.getError().message
  }.`;

  return resultFail;
}
