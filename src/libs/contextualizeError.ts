import { AppError } from '../types/AppError.js';
import { ResultFailure } from '../libs/Result.js';

export function contextualizeError(
  resultFail: ResultFailure<AppError>,
  prefixMessage: string,
) {
  resultFail.getError().message = `${prefixMessage} ${
    resultFail.getError().message
  }.`;

  return resultFail;
}
