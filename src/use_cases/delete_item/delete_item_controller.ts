import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ItemStore } from '../../stores/item_store/item_store.js';
import { UserStore } from '../../stores/user_store/user_store.js';
import { urlToShowItem } from '../show_item/map_show_item_routes.js';
import { Result } from '../../libs/result.js';

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

    const userId = resUser.getValue().id;

    const resDeletion = await this.itemStore.deleteBySlug(
      userId,
      itemSlug,
    );

    if (resDeletion.isFailure) {
      return resDeletion;
    }

    const redirectItemId = resUser.getValue().itemId;

    const resRedirectItem = await this.itemStore.getById(
      userId,
      redirectItemId,
    );

    if (resRedirectItem.isFailure) {
      return resRedirectItem;
    }

    const redirectItemSlug =
      resRedirectItem.getValue().slug;

    return Result.success({
      redirectToURL: urlToShowItem(
        username,
        redirectItemSlug,
      ),
    });
  }
}
