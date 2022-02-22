import { Code } from '@daisugi/kintsugi';
import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';
import { Result } from '../../libs/Result.js';

const schema = joi.object({
  newItemTitle: joi.string().required(),
  newItemIsPrivate: joi
    .boolean()
    .truthy('on')
    .optional()
    .default(false),
});

export function toEditItemRequest(request: AppRequest) {
  const response = schema.validate(request.body, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (response.error) {
    return Result.failure({
      code: Code.InvalidArgument,
      message: response.error.message,
    });
  }

  return Result.success(response.value);
}
