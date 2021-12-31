import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { toItemPresenter } from '../../presenters/toItemPresenter.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';

export class ShowItemController
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

    const resItem = await this.itemStore.get(
      userId,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    return result.ok({
      templatePath:
        'use-cases/show-item/templates/show-item.ejs',
      templateData: {
        item: toItemPresenter(resItem.value),
        user: resUser.value,
      },
    });
  }
}
