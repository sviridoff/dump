import { result } from '@daisugi/kintsugi';

import {
  ServiceController,
  ServiceReply,
  ServiceRequest,
} from '../../types/ServiceController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { toMoveItemPresenter } from './toMoveItemPresenter.js';
import { resultPromiseAll } from '../../libs/resultPromiseAll.js';

export class MoveItemController
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

    const res = await resultPromiseAll([
      this.itemStore.getBySlug(userId, itemSlug),
      this.itemStore.list(userId, itemSlug),
    ]);

    if (res.isFailure) {
      return res;
    }

    const [item, items] = res.value;

    return result.ok({
      templatePath:
        'use-cases/move-item/templates/move-item.ejs',
      templateData: toMoveItemPresenter(
        item,
        items,
        resUser.value,
      ),
    });
  }
}
