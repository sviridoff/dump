import { Code } from '@daisugi/kintsugi';
import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';
import { Result } from '../../libs/Result.js';

const schema = joi.object({
  childItemTitle: joi.string().required(),
  childItemIsPrivate: joi
    .boolean()
    .truthy('on')
    .optional()
    .default(false),
});

export function toCreateItemRequest(request: AppRequest) {
  const response = schema.validate(request.body, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (response.getError()) {
    return Result.failure({
      code: Code.BadRequest,
      message: response.getError().message,
    });
  }

  return Result.success(response.getValue());
}
