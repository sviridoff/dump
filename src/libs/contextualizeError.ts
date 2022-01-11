import { ResultFail } from '@daisugi/kintsugi';

import { ServiceError } from '../types/ServiceError.js';

export function contextualizeError(
  resultFail: ResultFail<ServiceError>,
  prefixMessage: string,
) {
  resultFail.error.message = `${prefixMessage} ${resultFail.error.message}.`;

  return resultFail;
}
