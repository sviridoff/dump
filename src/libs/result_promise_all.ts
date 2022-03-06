import {
  Result,
  ResultFailure,
  ResultSuccess,
} from './result.js';

async function handleResult(
  whenResult: Promise<
    ResultFailure<any> | ResultSuccess<any>
  >,
) {
  const response = await whenResult;
  if (response.isFailure) {
    return Promise.reject(response);
  }
  return response.getValue();
}

export async function resultPromiseAll(
  results: Promise<
    ResultFailure<any> | ResultSuccess<any>
  >[],
): Promise<ResultFailure<any> | ResultSuccess<any>> {
  const handledResults = results.map(handleResult);
  try {
    const values = await Promise.all(handledResults);
    return Result.success(values);
  } catch (error: any) {
    // We propagate result error.
    return error;
  }
}
