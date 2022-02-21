import { AppError } from '../types/AppError.js';
import { Result } from '../libs/Result.js';

export function contextualizeError(
  resultFail: Result<AppError>,
  prefixMessage: string,
) {
  resultFail.getError().message = `${prefixMessage} ${
    resultFail.getError().message
  }.`;

  return resultFail;
}
