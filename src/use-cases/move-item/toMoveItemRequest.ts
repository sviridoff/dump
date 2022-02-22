import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';
import { Result } from '../../libs/Result.js';
import { InvalidArgument } from '../../libs/Error.js';

const schema = joi.object({
  toItemSlug: joi.string().required(),
});

export function toMoveItemRequest(request: AppRequest) {
  const response = schema.validate(request.body, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (response.error) {
    return new InvalidArgument(response.error.message);
  }

  return Result.success(response.value);
}
