import { Code, result } from '@daisugi/kintsugi';
import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';

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
    return result.fail({
      code: Code.InvalidArgument,
      message: response.error.message,
    });
  }

  return result.ok(response.value);
}
