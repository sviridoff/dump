import { Code, result } from '@daisugi/kintsugi';
import joi from 'joi';

import { ServiceRequest } from '../../types/ServiceController.js';

const schema = joi.object({
  toItemSlug: joi.string().required(),
});

export function toMoveItemRequest(request: ServiceRequest) {
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
