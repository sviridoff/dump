import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { toCreateItemPresenter } from './toCreateItemPresenter.js';
import { toCreateItemRequest } from './toCreateItemRequest.js';
import { toSlug } from '../../libs/toSlug.js';

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

    const childItemSlug = toSlug(childItemTitle);

    const resChildItem = await this.itemStore.get(
      userId,
      childItemSlug,
    );

    if (resChildItem.isSuccess) {
      return result.ok({
        templatePath:
          'use-cases/create-item/templates/create-item.ejs',
        templateData: toCreateItemPresenter(
          resItem.value,
          resUser.value,
        ),
      });
    }

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
