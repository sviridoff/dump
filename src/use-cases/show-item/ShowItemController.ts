import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/AppController.js';
import { toShowItemPresenter } from './toShowItemPresenter.js';
import { ItemStore } from '../../stores/ItemStore.js';
import { UserStore } from '../../stores/UserStore.js';
import { Result } from '../../libs/Result.js';

export class ShowItemController implements AppController {
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

    const resItem = await this.itemStore.getBySlug(
      userId,
      itemSlug,
    );

    if (resItem.isFailure) {
      return resItem;
    }

    const resItemChild = await this.itemStore.getChild(
      resItem.getValue().id,
    );

    if (resItemChild.isFailure) {
      return resItemChild;
    }

    return Result.success({
      templatePath:
        'use-cases/show-item/templates/show-item.ejs',
      templateData: toShowItemPresenter(
        resItem.getValue(),
        resItemChild.getValue(),
        resUser.getValue(),
      ),
    });
  }
}
