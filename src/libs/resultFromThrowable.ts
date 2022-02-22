import { Fn } from '@daisugi/kintsugi';

import { Result, ResultSuccess, ResultFailure } from '../libs/Result.js';

export function resultFromThrowable<K>(
  fn: Fn,
  parseError: Fn,
) {
  return function (
    this: any,
    ...args: any[]
  ): ResultSuccess<K> | ResultFailure<any> {
    try {
      return Result.success(fn.apply(this, args));
    } catch (error) {
      return Result.failure(parseError(error));
    }
  };
}
