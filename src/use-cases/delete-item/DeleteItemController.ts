import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';

export class DeleteItemController
  implements ServiceController
{
  constructor(
    private itemStore: ItemStore,
    private userStore: UserStore,
  ) {}

  async handler(request: ServiceRequest): ServiceReply {
    const { username, itemSlug } = request.params;

    const resUser = await this.userStore.get(username);

    if (resUser.isFailure) {
      return resUser;
    }

    const userId = resUser.value.id;

    const resDeletion = await this.itemStore.deleteBySlug(
      resUser.value.id,
      itemSlug,
    );

    if (resDeletion.isFailure) {
      return resDeletion;
    }

    const itemId = resUser.value.itemId;

    const resItem = await this.itemStore.getById(
      userId,
      itemId,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    const redirectItemSlug = resItem.value.slug;

    return result.ok({
      redirectURL: urlToShowItem(
        username,
        redirectItemSlug,
      ),
    });
  }
}
