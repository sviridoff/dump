import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ItemStore } from '../../stores/item_store.js';
import { UserStore } from '../../stores/user_store.js';
import { toMoveItemPresenter } from './to_move_item_presenter.js';
import { resultPromiseAll } from '../../libs/result_promise_all.js';
import { urlToShowItem } from '../show_item/map_show_item_routes.js';
import { toMoveItemRequest } from './to_move_item_request.js';
import { Result } from '../../libs/result.js';

export class MoveItemController implements AppController {
  constructor(
    private itemStore: ItemStore,
    private userStore: UserStore,
  ) {}

  async handler(request: AppRequest): AppReply {
    const { method } = request;
    const { username, itemSlug } = request.params;

    if (method === 'GET') {
      const resUser = await this.userStore.get(username);

      if (resUser.isFailure) {
        return resUser;
      }

      const userId = resUser.getValue().id;

      const res = await resultPromiseAll([
        this.itemStore.getBySlug(userId, itemSlug),
        this.itemStore.getExcept(userId, itemSlug),
      ]);

      if (res.isFailure) {
        return res;
      }

      const [item, items] = res.getValue();

      return Result.success({
        templatePath:
          'use_cases/move_item/templates/move_item.ejs',
        templateData: toMoveItemPresenter(
          item,
          items,
          resUser.getValue(),
        ),
      });
    }

    const moveItemRequest = toMoveItemRequest(request);

    if (moveItemRequest.isFailure) {
      return moveItemRequest;
    }

    return Result.success({
      redirectToURL: urlToShowItem(username, itemSlug),
    });

    /*
    const { toItemSlug } = moveItemRequest.getValue();

    const res = await this.itemStore.move(
      itemSlug,
      toItemSlug,
    );

    if (res.isFailure) {
      return res;
    }

    return Result.success({
      redirectToURL: urlToShowItem(username, itemSlug),
    });
    */
  }
}
