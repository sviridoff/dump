import { result } from '@daisugi/kintsugi';

import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';

export class DeleteItemController implements AppController {
  constructor(
    private itemStore: ItemStore,
    private userStore: UserStore,
  ) {}

  async handler(request: AppRequest): AppReply {
    const { username, itemSlug } = request.params;

    const resUser = await this.userStore.get(username);

    if (resUser.isFailure) {
      return resUser;
    }

    const userId = resUser.value.id;

    const resDeletion = await this.itemStore.deleteBySlug(
      userId,
      itemSlug,
    );

    if (resDeletion.isFailure) {
      return resDeletion;
    }

    const redirectItemId = resUser.value.itemId;

    const resRedirectItem = await this.itemStore.getById(
      userId,
      redirectItemId,
    );

    if (resRedirectItem.isFailure) {
      return resRedirectItem;
    }

    const redirectItemSlug = resRedirectItem.value.slug;

    return result.ok({
      redirectToURL: urlToShowItem(
        username,
        redirectItemSlug,
      ),
    });
  }
}
