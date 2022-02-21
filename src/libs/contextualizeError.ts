import { ResultFail } from '@daisugi/kintsugi';

import { AppError } from '../types/AppError.js';

export function contextualizeError(
  resultFail: ResultFail<AppError>,
  prefixMessage: string,
) {
  resultFail.error.message = `${prefixMessage} ${resultFail.error.message}.`;

  return resultFail;
}
