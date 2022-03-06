import joi from 'joi';

import { AppRequest } from '../../types/app_controller.js';
import { Result } from '../../libs/result.js';
import { invalidArgument } from '../../libs/error.js';

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
    return invalidArgument(response.error.message);
  }

  return Result.success(response.value);
}
