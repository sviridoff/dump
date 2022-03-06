import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ItemStore } from '../../stores/item_store/item_store.js';
import { UserStore } from '../../stores/user_store/user_store.js';
import { toEditItemPresenter } from './to_edit_item_presenter.js';
import { toEditItemRequest } from './to_edit_item_request.js';
import { toSlug } from '../../libs/to_slug.js';
import { urlToShowItem } from '../show_item/map_show_item_routes.js';
import { Result } from '../../libs/result.js';

export class EditItemController implements AppController {
  constructor(
    private itemStore: ItemStore,
    private userStore: UserStore,
  ) {}

  async handler(request: AppRequest): AppReply {
    const { method } = request;
    const { username, itemSlug } = request.params;

    const resUser = await this.userStore.get(username);

    if (resUser.isFailure) {
      return resUser;
    }

    const userId = resUser.getValue().id;

    const resItem = await this.itemStore.getBySlug(
      userId,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    if (method === 'GET') {
      return Result.success({
        templatePath:
          'use_cases/edit_item/templates/edit_item.ejs',
        templateData: toEditItemPresenter(
          resItem.getValue(),
          resUser.getValue(),
        ),
      });
    }

    // POST

    const resEditItemRequest = toEditItemRequest(request);

    if (resEditItemRequest.isFailure) {
      return resEditItemRequest;
    }

    const { newItemTitle, newItemIsPrivate } =
      resEditItemRequest.getValue();

    const newItemSlug = toSlug(newItemTitle);
    const itemId = resItem.getValue().id;

    const res = await this.itemStore.edit(
      itemId,
      newItemTitle,
      newItemSlug,
      newItemIsPrivate,
    );

    if (res.isFailure) {
      return res;
    }

    return Result.success({
      redirectToURL: urlToShowItem(username, newItemSlug),
    });
  }
}
