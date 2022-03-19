import joi from 'joi';

import { AppRequest } from '../../types/app_controller.js';
import { Result } from '../../libs/result.js';
import { invalidArgument } from '../../libs/error.js';

export class CreateItemRequest {
  static #schema = joi.object({
    childItemTitle: joi.string().required(),
    childItemIsPrivate: joi
      .boolean()
      .truthy('on')
      .optional()
      .default(false),
  });
  constructor(
    public childItemTitle: string,
    public childItemIsPrivate: boolean,
  ) {}
  static resFromRequest(request: AppRequest) {
    const response = CreateItemRequest.#schema.validate(
      request.body,
      {
        allowUnknown: true,
        stripUnknown: true,
      },
    );
    if (response.error) {
      return invalidArgument(response.error.message);
    }
    return Result.success(
      new CreateItemRequest(
        response.value.childItemTitle,
        response.value.childItemIsPrivate,
      ),
    );
  }
}
