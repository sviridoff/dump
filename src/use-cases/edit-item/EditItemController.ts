import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { toEditItemPresenter } from './toEditItemPresenter.js';
import { toEditItemRequest } from './toEditItemRequest.js';
import { toSlug } from '../../libs/toSlug.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { Result } from '../../libs/Result.js';

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
          'use-cases/edit-item/templates/edit-item.ejs',
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
