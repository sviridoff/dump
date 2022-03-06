import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ItemStore } from '../../stores/item_store/item_store.js';
import { UserStore } from '../../stores/user_store/user_store.js';
import { MoveItemPresenter } from './move_item_presenter.js';
import { urlToShowItem } from '../show_item/map_show_item_routes.js';
import { MoveItemRequest } from './move_item_request.js';
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

      const res = await Result.promiseAll([
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
        templateData: new MoveItemPresenter(
          item,
          items,
          resUser.getValue(),
        ),
      });
    }

    const resMoveItemRequest =
      MoveItemRequest.resFromRequest(request);

    if (resMoveItemRequest.isFailure) {
      return resMoveItemRequest;
    }

    return Result.success({
      redirectToURL: urlToShowItem(username, itemSlug),
    });

    /*
    const { toItemSlug } = resMoveItemRequest.getValue();

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
