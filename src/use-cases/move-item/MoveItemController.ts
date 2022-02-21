import { result } from '@daisugi/kintsugi';

import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { toMoveItemPresenter } from './toMoveItemPresenter.js';
import { resultPromiseAll } from '../../libs/resultPromiseAll.js';
import { urlToShowItem } from '../show-item/mapShowItemRoutes.js';
import { toMoveItemRequest } from './toMoveItemRequest.js';

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

      const userId = resUser.value.id;

      const res = await resultPromiseAll([
        this.itemStore.getBySlug(userId, itemSlug),
        this.itemStore.getExcept(userId, itemSlug),
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

    const moveItemRequest = toMoveItemRequest(request);

    if (moveItemRequest.isFailure) {
      return moveItemRequest;
    }

    const { toItemSlug } = moveItemRequest.value;

    const res = await this.itemStore.move(
      itemSlug,
      toItemSlug,
    );

    if (res.isFailure) {
      return res;
    }

    return result.ok({
      redirectToURL: urlToShowItem(username, itemSlug),
    });
  }
}
