import { Code, result } from '@daisugi/kintsugi';
import joi from 'joi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { toItemPresenter } from '../../presenters/toItemPresenter.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';

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

    if (method === 'GET') {
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

      return result.ok({
        templatePath:
          'use-cases/create-item/templates/create-item.ejs',
        templateData: {
          item: toItemPresenter(resItem.value),
          user: resUser.value,
        },
      });
    }

    const resUser = await this.userStore.get(username);

    if (resUser.isFailure) {
      return resUser;
    }

    const userId = resUser.value.id;

    const resCreateItemRequest =
      toCreateItemRequest(request);

    if (resCreateItemRequest.isFailure) {
      return resCreateItemRequest;
    }

    const { childItemTitle, childItemIsPrivate } =
      resCreateItemRequest.value;

    console.log('GGGGGGG', childItemIsPrivate);

    const resItem = await this.itemStore.create(
      userId,
      itemSlug,
      childItemTitle,
      childItemIsPrivate,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    return result.ok({
      redirectURL: urlToShowItem(username, itemSlug),
    });
  }
}
