import { Code } from '@daisugi/kintsugi';
import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';
import { Result } from '../../libs/Result.js';

const schema = joi.object({
  toItemSlug: joi.string().required(),
});

export function toMoveItemRequest(request: AppRequest) {
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
