import joi from 'joi';

import { AppRequest } from '../../types/app_controller.js';
import { Result } from '../../libs/result.js';
import { invalidArgument } from '../../libs/error.js';

export class MoveItemRequest {
  static #schema = joi.object({
    toItemSlug: joi.string().required(),
  });
  constructor(public toItemSlug: string) {}
  static resFromRequest(request: AppRequest) {
    const response = MoveItemRequest.#schema.validate(
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
      new MoveItemRequest(response.value.toItemSlug),
    );
  }
}
