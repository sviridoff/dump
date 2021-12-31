import { Code, result } from '@daisugi/kintsugi';
import joi from 'joi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { toCreateItemPresenter } from './toCreateItemPresenter.js';

const schema = joi.object({
  childItemTitle: joi.string().required(),
  childItemIsPrivate: joi
    .boolean()
    .truthy('on')
    .optional()
    .default(false),
});

function toCreateItemRequest(request: ServiceRequest) {
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

export class CreateItemController
  implements ServiceController
{
  constructor(
    private itemStore: ItemStore,
    private userStore: UserStore,
  ) {}

  async handler(request: ServiceRequest): ServiceReply {
    const { method } = request;
    const { username, itemSlug } = request.params;

    const resUser = await this.userStore.get(username);

    if (resUser.isFailure) {
      return resUser;
    }

    const userId = resUser.value.id;

    const resItem = await this.itemStore.get(
      userId,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    if (method === 'GET') {
      return result.ok({
        templatePath:
          'use-cases/create-item/templates/create-item.ejs',
        templateData: toCreateItemPresenter(
          resItem.value,
          resUser.value,
        ),
      });
    }

    // POST

    const resCreateItemRequest =
      toCreateItemRequest(request);

    if (resCreateItemRequest.isFailure) {
      return resCreateItemRequest;
    }

    const { childItemTitle, childItemIsPrivate } =
      resCreateItemRequest.value;

    const parentItemId = resItem.value.id;

    const res = await this.itemStore.create(
      userId,
      parentItemId,
      childItemTitle,
      childItemIsPrivate,
    );

    if (res.isFailure) {
      return res;
    }

    return result.ok({
      redirectURL: urlToShowItem(username, itemSlug),
    });
  }
}
