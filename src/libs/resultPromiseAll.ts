import { Result, result } from '@daisugi/kintsugi';

async function handleResult(whenResult: Promise<Result>) {
  const response = await whenResult;

  if (response.isFailure) {
    return Promise.reject(response);
  }

  return response.value;
}

export async function resultPromiseAll(
  results: Promise<Result>[],
): Promise<Result> {
  const handledResults = results.map(handleResult);

  try {
    const values = await Promise.all(handledResults);

    return result.ok(values);
  } catch (error: any) {
    // We propagate result error.
    return error;
  }
}
