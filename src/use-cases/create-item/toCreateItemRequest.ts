import { Code, result } from '@daisugi/kintsugi';
import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';

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

  if (response.error) {
    return result.fail({
      code: Code.BadRequest,
      message: response.error.message,
    });
  }

  return result.ok(response.value);
}
