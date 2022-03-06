import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ItemStore } from '../../stores/item_store/item_store.js';
import { UserStore } from '../../stores/user_store/user_store.js';
import { urlToShowItem } from '../show_item/map_show_item_routes.js';
import { CreateItemPresenter } from './create_item_presenter.js';
import { toCreateItemRequest } from './to_create_item_request.js';
import { toSlug } from '../../libs/to_slug.js';
import { Result } from '../../libs/result.js';

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
          'use_cases/create_item/templates/create_item.ejs',
        templateData: new CreateItemPresenter(
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
          'use_cases/create_item/templates/create_item.ejs',
        templateData: new CreateItemPresenter(
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
