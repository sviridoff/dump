import {
  result,
  ResultFail,
  ResultOK,
  Fn,
} from '@daisugi/kintsugi';

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
