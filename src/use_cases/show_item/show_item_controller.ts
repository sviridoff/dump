import {
  AppController,
  AppReply,
  AppRequest,
} from '../../types/app_controller.js';
import { ShowItemPresenter } from './show_item_presenter.js';
import { ItemStore } from '../../stores/item_store/item_store.js';
import { UserStore } from '../../stores/user_store/user_store.js';
import { Result } from '../../libs/result.js';

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
        'use_cases/show_item/templates/show_item.ejs',
      templateData: new ShowItemPresenter(
        resItem.getValue(),
        resItemChild.getValue(),
        resUser.getValue(),
      ),
    });
  }
}
