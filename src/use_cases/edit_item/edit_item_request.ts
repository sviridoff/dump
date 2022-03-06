import joi from 'joi';

import { AppRequest } from '../../types/app_controller.js';
import { Result } from '../../libs/result.js';
import { invalidArgument } from '../../libs/error.js';

export class EditItemRequest {
  static #schema = joi.object({
    newItemTitle: joi.string().required(),
    newItemIsPrivate: joi
      .boolean()
      .truthy('on')
      .optional()
      .default(false),
  });
  constructor(
    public newItemTitle: string,
    public newItemIsPrivate: boolean,
  ) {}
  static resFromRequest(request: AppRequest) {
    const response = EditItemRequest.#schema.validate(
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
      new EditItemRequest(
        response.value.newItemTitle,
        response.value.newItemIsPrivate,
      ),
    );
  }
}
