import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { toCreateItemPresenter } from './toCreateItemPresenter.js';
import { toCreateItemRequest } from './toCreateItemRequest.js';
import { toSlug } from '../../libs/toSlug.js';
import { Result } from '../../libs/Result.js';

export class CreateItemController implements AppController {
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
          'use-cases/create-item/templates/create-item.ejs',
        templateData: toCreateItemPresenter(
          resItem.getValue(),
          resUser.getValue(),
        ),
      });
    }

    // POST

    const resCreateItemRequest =
      toCreateItemRequest(request);

    if (resCreateItemRequest.isFailure) {
      return resCreateItemRequest;
    }

    const { childItemTitle, childItemIsPrivate } =
      resCreateItemRequest.getValue();

    const childItemSlug = toSlug(childItemTitle);

    const resChildItem = await this.itemStore.getBySlug(
      userId,
      childItemSlug,
    );

    if (resChildItem.isSuccess) {
      return Result.success({
        templatePath:
          'use-cases/create-item/templates/create-item.ejs',
        templateData: toCreateItemPresenter(
          resItem.getValue(),
          resUser.getValue(),
        ),
      });
    }

    const parentItemId = resItem.getValue().id;

    const res = await this.itemStore.create(
      userId,
      parentItemId,
      childItemTitle,
      childItemIsPrivate,
    );

    if (res.isFailure) {
      return res;
    }

    return Result.success({
      redirectToURL: urlToShowItem(username, itemSlug),
    });
  }
}
