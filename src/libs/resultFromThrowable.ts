import {
  result,
  ResultFail,
  ResultOK,
} from '@daisugi/kintsugi';

import { Fn } from '../types/Fn';

export function resultFromThrowable<K>(
  fn: Fn,
  parseError: Fn,
) {
  return function (
    this: any,
    ...args: any[]
  ): ResultOK<K> | ResultFail<any> {
    try {
      return result.ok(fn.apply(this, args));
    } catch (error) {
      return result.fail(parseError(error));
    }
  };
}
