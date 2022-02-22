import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { Result } from '../../libs/Result.js';

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

    const redirectItemSlug = resRedirectItem.getValue().slug;

    return Result.success({
      redirectToURL: urlToShowItem(
        username,
        redirectItemSlug,
      ),
    });
  }
}
