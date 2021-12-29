import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';

export class CreateItemController
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

    const resItem = await this.itemStore.get(
      resUser.value.id,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    return result.ok({
      templatePath:
        'use-cases/create-item/templates/create-item.ejs',
      templateData: {
        item: resItem.value,
        user: resUser.value,
      },
    });
  }
}
