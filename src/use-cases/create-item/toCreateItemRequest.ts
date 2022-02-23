import joi from 'joi';

import { AppRequest } from '../../types/AppController.js';
import { Result } from '../../libs/Result.js';
import { badRequest } from '../../libs/Error.js';

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
    return badRequest(response.error.message);
  }

  return Result.success(response.value);
}
