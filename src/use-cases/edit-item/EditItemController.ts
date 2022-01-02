import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { toEditItemPresenter } from './toEditItemPresenter.js';
import { toEditItemRequest } from './toEditItemRequest.js';
import { toSlug } from '../../libs/toSlug.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';

export class EditItemController
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
          'use-cases/edit-item/templates/edit-item.ejs',
        templateData: toEditItemPresenter(
          resItem.value,
          resUser.value,
        ),
      });
    }

    // POST

    const resEditItemRequest = toEditItemRequest(request);

    if (resEditItemRequest.isFailure) {
      return resEditItemRequest;
    }

    const { newItemTitle, newItemIsPrivate } =
      resEditItemRequest.value;

    const newItemSlug = toSlug(newItemTitle);
    const itemId = resItem.value.id;

    const res = await this.itemStore.edit(
      itemId,
      newItemTitle,
      newItemSlug,
      newItemIsPrivate,
    );

    if (res.isFailure) {
      return res;
    }

    return result.ok({
      redirectURL: urlToShowItem(username, newItemSlug),
    });
  }
}